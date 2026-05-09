-- Create the role_permissions table
CREATE TABLE public.role_permissions (
    role text PRIMARY KEY,
    can_manage_agenda boolean DEFAULT false,
    can_manage_gallery boolean DEFAULT false,
    can_manage_news boolean DEFAULT false,
    can_manage_clothing boolean DEFAULT false,
    can_manage_lottery boolean DEFAULT false,
    can_manage_actas boolean DEFAULT false,
    can_manage_roles boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default permissions
INSERT INTO public.role_permissions (role, can_manage_agenda, can_manage_gallery, can_manage_news, can_manage_clothing, can_manage_lottery, can_manage_actas, can_manage_roles) VALUES
    ('admin', true, true, true, true, true, true, true),
    ('editor', false, false, true, false, false, false, false),
    ('author', false, false, true, false, false, false, false),
    ('directivo/a', true, true, true, false, false, false, false),
    ('subscriber', false, false, false, false, false, false, false);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policy for reading (everyone can read so the UI knows what they can do)
CREATE POLICY "Role permissions are viewable by everyone" ON public.role_permissions
    FOR SELECT USING (true);

-- Create policy for updating (only admins can update, we use a simple auth check if needed, but let's allow authenticated users and verify in the backend, or rely on app UI to block it. Best is to check if the user is admin)
-- A user is an admin if their email is fallaturia@gmail.com OR if their profile role is 'admin' AND they have can_manage_roles.
-- To avoid complex recursive queries, we allow updates by authenticated users, but the UI protects it. 
-- In a real secure app, we'd add an admin check here. Let's make it secure:
CREATE POLICY "Role permissions can be updated by admins" ON public.role_permissions
    FOR UPDATE USING (
        (auth.jwt() ->> 'email') = 'fallaturia@gmail.com' OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
