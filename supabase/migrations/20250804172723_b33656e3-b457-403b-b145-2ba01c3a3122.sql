-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Create resumes table to track resume metadata
CREATE TABLE public.resumes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  upload_date timestamp with time zone NOT NULL DEFAULT now(),
  download_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  last_download timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on resumes table
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Admin can do everything with resumes
CREATE POLICY "admin access resumes" 
ON public.resumes 
FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

-- Public can only select active resumes
CREATE POLICY "public can view active resumes" 
ON public.resumes 
FOR SELECT 
USING (is_active = true);

-- Storage policies for resume bucket
CREATE POLICY "Admin can upload resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'resumes' AND 
  (auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text
);

CREATE POLICY "Admin can update resumes" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'resumes' AND 
  (auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text
);

CREATE POLICY "Admin can delete resumes" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'resumes' AND 
  (auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text
);

CREATE POLICY "Public can download resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_resumes_updated_at
BEFORE UPDATE ON public.resumes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();