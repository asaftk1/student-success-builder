
-- בדיקה אם החשבון קיים ב-profiles
SELECT * FROM public.profiles WHERE email = 'asaftk1@gmail.com';

-- אם החשבון לא קיים ב-profiles, ניצור אותו
INSERT INTO public.profiles (id, email, full_name, role, is_approved)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'אסף גלילי'), 
  'admin', 
  true
FROM auth.users 
WHERE email = 'asaftk1@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'asaftk1@gmail.com'
);

-- וודא שהחשבון מאושר כמנהל
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'asaftk1@gmail.com';
