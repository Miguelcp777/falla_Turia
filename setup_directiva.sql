-- ============================================
-- DIRECTIVA TABLE - Org Chart for Falla Turia
-- ============================================

CREATE TABLE IF NOT EXISTS public.directiva (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL DEFAULT '',
    position text NOT NULL,
    level int NOT NULL DEFAULT 1,       -- 1=Presidente, 2=Vice, 3=Secretario/Tesorero, 4=Vocales
    sort_order int NOT NULL DEFAULT 0,  -- order within same level
    photo_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.directiva ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view
CREATE POLICY "Authenticated users can view directiva"
    ON public.directiva FOR SELECT
    TO authenticated
    USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage directiva"
    ON public.directiva FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'directivo/a')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'directivo/a')
        )
    );

-- Seed with empty template positions
INSERT INTO public.directiva (name, position, level, sort_order) VALUES
    ('', 'Presidente/a', 1, 1),
    ('', 'Vicepresidente/a 1º', 2, 1),
    ('', 'Vicepresidente/a 2º', 2, 2),
    ('', 'Secretario/a', 3, 1),
    ('', 'Tesorero/a', 3, 2),
    ('', 'Vocal 1º', 4, 1),
    ('', 'Vocal 2º', 4, 2),
    ('', 'Vocal 3º', 4, 3),
    ('', 'Vocal 4º', 4, 4);
