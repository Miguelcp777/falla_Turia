-- Activar extensión pgvector para trabajar con embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Crear tabla para almacenar metadatos de los documentos (Actas)
CREATE TABLE IF NOT EXISTS public.documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    file_path text NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla para almacenar los fragmentos (chunks) y sus embeddings
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE,
    content text NOT NULL,
    embedding vector(1536)
);

-- Función para buscar similitud (se usará en el futuro chatbot)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  document_id uuid,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Seguridad
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- Permisos de lectura de documentos para usuarios autenticados
CREATE POLICY "Documents are viewable by authenticated users" ON public.documents
    FOR SELECT TO authenticated USING (true);

-- Política para que el servicio admin (Service Role) pueda saltarse la validación al insertar.
-- Y que los usuarios con permiso puedan insertar (esto si el cliente inserta el doc).
-- Usaremos la service_role key en nuestro backend de Netlify, así que no hace falta RLS muy permisiva de insert, pero la dejamos por si acaso.
CREATE POLICY "Admins can insert documents" ON public.documents
    FOR INSERT TO authenticated WITH CHECK (
        (auth.jwt() ->> 'email') = 'fallaturia@gmail.com' OR
        EXISTS (
            SELECT 1 FROM role_permissions rp
            JOIN profiles p ON p.role = rp.role
            WHERE p.id = auth.uid() AND rp.can_manage_actas = true
        )
    );

CREATE POLICY "Admins can delete documents" ON public.documents
    FOR DELETE TO authenticated USING (
        (auth.jwt() ->> 'email') = 'fallaturia@gmail.com' OR
        EXISTS (
            SELECT 1 FROM role_permissions rp
            JOIN profiles p ON p.role = rp.role
            WHERE p.id = auth.uid() AND rp.can_manage_actas = true
        )
    );

-- Nota Importante para Storage:
-- 1. Ve a "Storage" en Supabase.
-- 2. Crea un nuevo bucket llamado "actas".
-- 3. Entra a las "Policies" del bucket "actas".
-- 4. Añade una política "SELECT" para "authenticated users".
-- 5. Añade una política "INSERT", "UPDATE" y "DELETE" para los roles que gestionan actas.
-- Opcionalmente puedes hacer el bucket "Public" si no hay actas secretas.
