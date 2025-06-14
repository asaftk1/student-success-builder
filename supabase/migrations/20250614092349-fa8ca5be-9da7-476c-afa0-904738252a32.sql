
-- מחיקת המדיניות הקיימת
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- יצירת מדיניות חדשה שמאפשרת למשתמשים לראות את הפרופיל שלהם
-- ולמנהלים לראות את כל הפרופילים
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND is_approved = true
  )
);

-- מדיניות לעדכון פרופילים - משתמשים יכולים לעדכן את עצמם, מנהלים יכולים לעדכן את כולם
CREATE POLICY "Users can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND is_approved = true
  )
);
