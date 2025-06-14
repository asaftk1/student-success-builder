
-- עדכון הפרופיל של המנהל הראשי
UPDATE public.profiles 
SET 
  role = 'admin',
  is_approved = true,
  full_name = 'אסף גלילי'
WHERE email = 'asaftk1@gmail.com';

-- אם הפרופיל לא קיים, ניצור אותו
INSERT INTO public.profiles (id, email, full_name, role, is_approved)
SELECT 
  au.id,
  au.email,
  'אסף גלילי',
  'admin',
  true
FROM auth.users au
WHERE au.email = 'asaftk1@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
  );
