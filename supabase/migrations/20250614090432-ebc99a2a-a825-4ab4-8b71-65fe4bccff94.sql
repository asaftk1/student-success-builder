
-- מחיקת המדיניות הקיימת שגורמת לרקורסיה
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- יצירת מדיניות פשוטה שמאפשרת למשתמשים לראות את הפרופיל שלהם
CREATE POLICY "Enable read access for users based on user_id" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- מדיניות שמאפשרת למשתמשים לעדכן את הפרופיל שלהם
CREATE POLICY "Enable update for users based on user_id" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- מדיניות שמאפשרת הכנסת פרופילים חדשים
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);
