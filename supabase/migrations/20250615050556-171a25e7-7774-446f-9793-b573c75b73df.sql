
-- עדכון התפקידים במערכת
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'coordinator', 'teacher', 'instructor', 'group_coordinator'));

-- יצירת טבלת קבוצות
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- הכנסת הקבוצות עם התיאורים הנכונים
INSERT INTO public.groups (name, description) VALUES 
('נחשול', 'קבוצת נחשול'),
('אלמוג', 'קבוצת אלמוג'),
('מגדלור', 'קבוצת מגדלור'),
('עוגן', 'קבוצת עוגן')
ON CONFLICT DO NOTHING;

-- הוספת עמודה לחיבור משתמשים לקבוצות
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id);

-- הפעלת RLS על טבלת קבוצות
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- מדיניות לקריאת קבוצות - כולם יכולים לראות את רשימת הקבוצות
CREATE POLICY "Everyone can view groups" ON public.groups
  FOR SELECT 
  USING (true);

-- מדיניות לעדכון קבוצות - רק מנהלים ורכזים פדגוגיים
CREATE POLICY "Admins and coordinators can manage groups" ON public.groups
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'coordinator') 
      AND is_approved = true
    )
  );
