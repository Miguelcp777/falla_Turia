import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const TURIANIN_SYSTEM_PROMPT = `Ets en Turianin 🦇, la mascota del xiruc de la Falla Turia Plaça de l'Ajuntament de València. Ets un ratpenat molt simpàtic, alegre i proper, expert en tot el que fa referència a la falla i les tradicions falleres valencianes.

PERSONALITAT:
- Ets MOLT simpàtic, entusiasta i proper. Sempre de bon humor! 🔥
- Respons SEMPRE en l'idioma en que et parlen: si et parlen en Valencià, respons en Valencià; si et parlen en Castellà, respons en Castellà.
- Fas servir expressions valencianes de tant en tant: "¡Visca la falla!", "¡Alça!", "¡Això és!", "¡Au va!", "Meravellós!", "¡Ole!", "¡Qué guapo!"
- Ets un expert en les tradicions falleres, la cultura valenciana i tot el que fa referència a la Falla Turia.
- Fas servir emojis per ser més expressiu: 🦇🔥🎆🎇✨🎉🦩💥

INSTRUCCIONS:
- Usa el context de les actes proporcionat per respondre preguntes sobre decisions, reunions, pressupostos, acords, etc.
- Si no tens informació concreta en el context, ho dius amablement i suggests preguntar directament a la directiva.
- MAI inventes informació sobre acords, decisions o dades de la falla que no estiguin en el context.
- Pots parlar sobre les tradicions falleres, la mascletà, la cremà, les ninots, etc. de forma general.
- Ets breu i concís, però sempre proper i amable.
- Si et pregunten qui ets, explica que ets en Turianin, la mascota de la Falla Turia Plaça de l'Ajuntament!

CONTEXT DE LA FALLA:
La Falla Turia Plaça de l'Ajuntament és una de les falles més emblemàtiques de València, ubicada al cor de la ciutat, a la Plaça de l'Ajuntament.`;

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { message, conversationHistory = [] } = JSON.parse(event.body || '{}');

        if (!message) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing message' }) };
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const openaiApiKey = process.env.OPENAI_API_KEY;

        if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) };
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const openai = new OpenAI({ apiKey: openaiApiKey });

        // 1. Fetch Agenda (Upcoming events)
        const { data: events } = await supabase
            .from('agenda')
            .select('title, description, event_date, location')
            .gte('event_date', new Date().toISOString())
            .order('event_date', { ascending: true })
            .limit(5);

        const agendaContext = events && events.length > 0 
            ? '\n\n--- PRÓXIMOS EVENTOS (AGENDA) ---\n' + 
              events.map(e => `- ${e.title} (${new Date(e.event_date).toLocaleDateString()} a les ${new Date(e.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}h): ${e.description} en ${e.location}`).join('\n')
            : '';

        // 2. Fetch Latest News
        const { data: news } = await supabase
            .from('news')
            .select('title, content, published_at')
            .order('published_at', { ascending: false })
            .limit(3);

        const newsContext = news && news.length > 0
            ? '\n\n--- ÚLTIMAS NOTICIAS ---\n' +
              news.map(n => `- ${n.title} (${new Date(n.published_at).toLocaleDateString()}): ${n.content.substring(0, 200)}...`).join('\n')
            : '';

        // 3. Generate embedding for the query to search relevant actas
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: message,
        });

        const queryEmbedding = embeddingResponse.data[0].embedding;

        // 4. Search for relevant document chunks in the vector DB
        console.log(`Searching for context for message: "${message}"`);
        const { data: matchedChunks, error: rpcError } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3, 
            match_count: 5
        });

        if (rpcError) {
            console.error('RPC Error:', rpcError);
        }

        console.log(`Found ${matchedChunks?.length || 0} matching chunks`);

        let actasContext = '';
        if (matchedChunks && matchedChunks.length > 0) {
            actasContext = '\n\n--- CONTEXT DE LES ACTES DE LA FALLA (REUNIONS) ---\n' +
                matchedChunks.map((c: any) => c.content).join('\n\n---\n\n') +
                '\n--- FI DEL CONTEXT DE LES ACTES ---';
        }

        // 5. Build messages for ChatCompletion with conversation history
        const systemPrompt = TURIANIN_SYSTEM_PROMPT + agendaContext + newsContext + actasContext;

        const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...conversationHistory.slice(-8).map((m: any) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            })),
            { role: 'user' as const, content: message }
        ];

        // 6. Get response from OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 600,
            temperature: 0.75
        });

        const reply = completion.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply })
        };

    } catch (error: any) {
        console.error('Turianin chat error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Internal Server Error' })
        };
    }
};
