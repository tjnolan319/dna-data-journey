-- Create a table for managing homepage sections visibility
CREATE TABLE public.homepage_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admin can manage homepage sections" 
ON public.homepage_sections 
FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

-- Create policy for public to view visible sections
CREATE POLICY "Public can view visible sections" 
ON public.homepage_sections 
FOR SELECT 
USING (is_visible = true);

-- Insert default sections
INSERT INTO public.homepage_sections (section_name, is_visible, display_order) VALUES
('hero', true, 1),
('tech-stack', true, 2),
('projects', true, 3),
('timeline', true, 4),
('gallery', true, 5),
('contact', true, 6);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_homepage_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_homepage_sections_updated_at();