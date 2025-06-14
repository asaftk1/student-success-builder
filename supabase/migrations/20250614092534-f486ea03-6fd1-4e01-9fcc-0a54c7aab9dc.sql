
-- מחיקת המדיניות הבעייתית
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON public.profiles;

-- יצירת פונקציה בטוחה לבדיקת תפקיד המשתמש
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- יצירת פונקציה בטוחה לבדיקת אישור המשתמש
CREATE OR REPLACE FUNCTION public.is_current_user_approved_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT (role = 'admin' AND is_approved = true) FROM public.profiles WHERE id = auth.uid();
$$;

-- מדיניות פשוטה שמאפשרת למשתמשים לראות את הפרופיל שלהם
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- מדיניות שמאפשרת למנהלים מאושרים לראות את כל הפרופילים
CREATE POLICY "Approved admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_approved_admin());

-- מדיניות לעדכון פרופיל עצמי
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- מדיניות שמאפשרת למנהלים מאושרים לעדכן את כל הפרופילים
CREATE POLICY "Approved admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_current_user_approved_admin());
