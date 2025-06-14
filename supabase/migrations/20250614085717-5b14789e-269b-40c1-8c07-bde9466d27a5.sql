
-- עדכון חשבון קיים להיות מנהל מאושר
-- החלף את 'YOUR_EMAIL@EXAMPLE.COM' באימייל שלך
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'asaftk1@gmail.com';

-- אם החשבון לא קיים, תוכל ליצור אותו ידנית:
-- INSERT INTO public.profiles (id, email, full_name, role, is_approved)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'asaftk1@gmail.com'),
--   'asaftk1@gmail.com',
--   'אסף גלילי',
--   'admin',
--   true
-- );
