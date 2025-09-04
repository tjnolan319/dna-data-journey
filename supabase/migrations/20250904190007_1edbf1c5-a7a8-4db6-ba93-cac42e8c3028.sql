-- Create lab-notes storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('lab-notes', 'lab-notes', true);

-- Create storage policies for lab-notes bucket
CREATE POLICY "Public can view lab note images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'lab-notes');

CREATE POLICY "Admin can manage lab note images" 
ON storage.objects FOR ALL 
USING (bucket_id = 'lab-notes' AND (auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);