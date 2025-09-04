-- Create gallery storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Create storage policies for gallery bucket
CREATE POLICY "Public can view gallery images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Admin can manage gallery images" 
ON storage.objects FOR ALL 
USING (bucket_id = 'gallery' AND (auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);