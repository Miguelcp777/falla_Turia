import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { PDFParse } from 'pdf-parse';

export const handler: Handler = async (event, context) => {
    // CORS headers for preflight requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { fileUrl, title, createdBy } = JSON.parse(event.body || '{}');

        if (!fileUrl || !title) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fileUrl or title' }) };
        }

        // Initialize Supabase client
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

        if (!supabaseUrl || !supabaseKey) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Supabase credentials missing on server' }) };
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Initialize OpenAI
        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'OpenAI API key missing on server' }) };
        }

        const openai = new OpenAI({
            apiKey: openaiApiKey,
        });

        // 1. Download the PDF file from the URL
        console.log("Downloading PDF from", fileUrl);
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to download PDF: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Extract text using pdf-parse
        console.log("Extracting text...");
        const parser = new PDFParse({ data: buffer });
        const pdfData = await parser.getText();
        const text = pdfData.text;

        if (!text || text.trim() === '') {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'No text found in the PDF' }) };
        }

        // 3. Create Document record in Supabase
        console.log("Creating document record...");
        const { data: document, error: docError } = await supabase
            .from('documents')
            .insert({
                title,
                file_path: fileUrl,
                created_by: createdBy
            })
            .select()
            .single();

        if (docError || !document) {
            throw new Error(`Error creating document: ${docError?.message}`);
        }

        // 4. Chunk the text
        console.log("Chunking text...");
        const rawChunks = text.split(/\n\s*\n/);
        let chunks: string[] = [];
        let currentChunk = '';
        
        for (const rc of rawChunks) {
            const cleanText = rc.trim();
            if (!cleanText) continue;
            
            if (currentChunk.length + cleanText.length > 1000) {
                if (currentChunk) chunks.push(currentChunk);
                currentChunk = cleanText;
            } else {
                currentChunk = currentChunk ? `${currentChunk}\n\n${cleanText}` : cleanText;
            }
        }
        if (currentChunk) chunks.push(currentChunk);

        // Fallback for very long single paragraphs
        let finalChunks: string[] = [];
        for (const c of chunks) {
            if (c.length > 2000) {
                const sentences = c.match(/[^.!?]+[.!?]+/g) || [c];
                let temp = '';
                for (const s of sentences) {
                    if (temp.length + s.length > 1000) {
                        finalChunks.push(temp.trim());
                        temp = s;
                    } else {
                        temp += ' ' + s;
                    }
                }
                if (temp.trim()) finalChunks.push(temp.trim());
            } else {
                finalChunks.push(c.trim());
            }
        }

        // 5. Generate embeddings and insert chunks
        console.log(`Generating embeddings for ${finalChunks.length} chunks...`);
        for (const chunk of finalChunks) {
            if (!chunk.trim()) continue;

            const embeddingResponse = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: chunk,
            });

            const [{ embedding }] = embeddingResponse.data;

            const { error: chunkError } = await supabase
                .from('document_chunks')
                .insert({
                    document_id: document.id,
                    content: chunk,
                    embedding,
                });

            if (chunkError) {
                console.error("Error inserting chunk", chunkError);
            }
        }

        console.log("Processing complete!");
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, documentId: document.id }),
        };

    } catch (error: any) {
        console.error('Error processing document:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
        };
    }
};
