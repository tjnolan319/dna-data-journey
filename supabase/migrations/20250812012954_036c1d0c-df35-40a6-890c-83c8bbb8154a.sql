-- Fix newsletter_subscribers RLS policies to prevent unauthorized access to subscriber data

-- First, ensure RLS is enabled (it should already be)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.newsletter_subscribers;

-- Allow anonymous users to insert new subscriptions (for signup functionality)
CREATE POLICY "Allow anonymous newsletter signup"
ON public.newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert subscriptions (for signed-in users)
CREATE POLICY "Allow authenticated newsletter signup"
ON public.newsletter_subscribers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only allow admin users to view subscriber data
CREATE POLICY "Admin can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

-- Only allow admin users to update subscriber data
CREATE POLICY "Admin can update newsletter subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

-- Only allow admin users to delete subscriber data
CREATE POLICY "Admin can delete newsletter subscribers"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);