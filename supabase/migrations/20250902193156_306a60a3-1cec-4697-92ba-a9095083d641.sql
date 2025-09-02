-- Create tech stack table
CREATE TABLE public.tech_stack (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  certified boolean NOT NULL DEFAULT false,
  cert_count integer DEFAULT 1,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create gallery images table  
CREATE TABLE public.gallery_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view tech stack" ON public.tech_stack FOR SELECT USING (true);
CREATE POLICY "Public can view active gallery images" ON public.gallery_images FOR SELECT USING (is_active = true);

-- Admin can manage all data
CREATE POLICY "Admin can manage tech stack" ON public.tech_stack FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

CREATE POLICY "Admin can manage gallery images" ON public.gallery_images FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

-- Insert existing tech stack data
INSERT INTO public.tech_stack (name, category, certified, cert_count, display_order) VALUES
('SQL', 'Database', false, 1, 0),
('Python', 'Programming', false, 1, 1),
('R Programming', 'Statistics', false, 1, 2),
('SPSS', 'Statistics', false, 1, 3),
('Alteryx', 'Data Workflow', true, 2, 4),
('Excel', 'Analytics', true, 1, 5),
('Tableau', 'Visualization', false, 1, 6),
('Power BI', 'Visualization', false, 1, 7),
('Drupal', 'Website Editing', false, 1, 8),
('Hubspot', 'CRM & Marketing', false, 1, 9),
('Qualtrics', 'Survey & Research', false, 1, 10);

-- Insert sample gallery images (using current DataGallery data)
INSERT INTO public.gallery_images (title, description, image_url, display_order) VALUES
('Sales Performance Analytics', 'Quarterly trends & forecasting models', 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop', 0),
('Customer Journey Mapping', 'Touchpoint analysis & conversion tracking', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop', 1),
('Market Segmentation Analysis', 'Advanced clustering for target identification', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop', 2),
('Financial Performance Dashboard', 'Real-time KPIs & predictive analytics', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop', 3);

-- Add triggers for updated_at
CREATE TRIGGER update_tech_stack_updated_at BEFORE UPDATE ON public.tech_stack FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();