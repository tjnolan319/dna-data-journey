-- Create tables for academic timeline data

-- Schools table
CREATE TABLE public.schools (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  degree text NOT NULL,
  period text NOT NULL,
  gpa numeric(3,2) NOT NULL,
  total_credits integer NOT NULL,
  completed_credits integer NOT NULL,
  honors text[] DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Awards table
CREATE TABLE public.awards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Semesters table
CREATE TABLE public.semesters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  semester text NOT NULL,
  year integer NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Courses table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester_id uuid NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  credits integer,
  description text,
  tools text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Public can view awards" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Public can view semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Public can view courses" ON public.courses FOR SELECT USING (true);

-- Admin can manage all data
CREATE POLICY "Admin can manage schools" ON public.schools FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

CREATE POLICY "Admin can manage awards" ON public.awards FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

CREATE POLICY "Admin can manage semesters" ON public.semesters FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

CREATE POLICY "Admin can manage courses" ON public.courses FOR ALL 
USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

-- Insert sample data

-- Insert schools
INSERT INTO public.schools (name, degree, period, gpa, total_credits, completed_credits, honors, display_order) VALUES
('Bentley University', 'Master of Science in Data Analytics & Master of Business Administration', '2023 - 2025', 3.85, 36, 28, ARRAY['Graduated on an accelerated 2-year program', 'Dual master''s degrees'], 0),
('University of Rhode Island', 'Bachelor of Science in Marketing & Bachelor of Arts in Psychology', '2021 - 2023', 3.72, 120, 120, ARRAY['Graduated on an accelerated 3-year track', 'Dual bachelor''s degrees'], 1);

-- Get school IDs for references
-- We'll need to insert awards, semesters, and courses using the school IDs

-- Insert awards for Bentley
INSERT INTO public.awards (school_id, title, description, date)
SELECT id, 'High Distinction', 'Academic excellence recognition for graduate studies', '2024-2025'
FROM public.schools WHERE name = 'Bentley University';

-- Insert awards for URI
INSERT INTO public.awards (school_id, title, description, date)
SELECT id, title, description, date FROM public.schools s
CROSS JOIN (VALUES 
  ('Summa Cum Laude', 'Highest academic honors for undergraduate studies', 'May 2023'),
  ('Dean''s List', '6/6 semesters', '2021-2023'),
  ('Marketing Award for Scholastic Achievement & Service Excellence', 'Recognized for outstanding academic performance and community service', 'May 2023')
) AS v(title, description, date)
WHERE s.name = 'University of Rhode Island';

-- Insert semesters for Bentley
INSERT INTO public.semesters (school_id, semester, year, display_order)
SELECT id, semester, year, display_order FROM public.schools s
CROSS JOIN (VALUES 
  ('Fall', 2023, 0),
  ('Spring', 2024, 1),
  ('Summer', 2024, 2),
  ('Fall', 2024, 3),
  ('Spring', 2025, 4)
) AS v(semester, year, display_order)
WHERE s.name = 'Bentley University';

-- Insert semesters for URI
INSERT INTO public.semesters (school_id, semester, year, display_order)
SELECT id, semester, year, display_order FROM public.schools s
CROSS JOIN (VALUES 
  ('Fall', 2021, 0),
  ('Winter', 2022, 1),
  ('Spring', 2022, 2),
  ('Summer', 2022, 3),
  ('Fall', 2022, 4),
  ('Spring', 2023, 5)
) AS v(semester, year, display_order)
WHERE s.name = 'University of Rhode Island';

-- Insert courses for Bentley Fall 2023
INSERT INTO public.courses (semester_id, code, name, credits, description, tools)
SELECT s.id, code, name, credits, description, tools FROM public.semesters s
JOIN public.schools sc ON s.school_id = sc.id
CROSS JOIN (VALUES 
  ('CS 605', 'Data Management and SQL for Analytics', 3, 'Comprehensive introduction to database design and SQL programming for analytics applications.', ARRAY['SQL', 'MySQL', 'PostgreSQL']),
  ('FI 623', 'Investments', 3, 'Analysis of investment vehicles, portfolio theory, and capital market efficiency.', ARRAY['Excel', 'Bloomberg Terminal', 'Python']),
  ('GR 603', 'Leading Responsibly', 3, 'Examination of ethical leadership principles in modern business contexts.', ARRAY['Case Studies', 'Leadership Assessments']),
  ('IPM 652', 'Managing with Analytics', 3, 'Application of data analytics to strategic business decision making.', ARRAY['Tableau', 'R', 'Excel'])
) AS v(code, name, credits, description, tools)
WHERE sc.name = 'Bentley University' AND s.semester = 'Fall' AND s.year = 2023;

-- Insert courses for Bentley Spring 2024
INSERT INTO public.courses (semester_id, code, name, credits, description, tools)
SELECT s.id, code, name, credits, description, tools FROM public.semesters s
JOIN public.schools sc ON s.school_id = sc.id
CROSS JOIN (VALUES 
  ('GR 601', 'Strategic Information Technology Alignment', 3, 'Integration of IT strategy with business objectives and organizational capabilities.', ARRAY['Enterprise Architecture Tools', 'Business Process Modeling']),
  ('GR 602', 'Business Process Management', 3, 'Design, analysis, and optimization of business processes for operational excellence.', ARRAY['BPMN', 'Process Mining Tools', 'Visio']),
  ('MA 610', 'Optimization and Simulation for Business Decisions', 3, 'Mathematical optimization techniques and simulation modeling for business applications.', ARRAY['MATLAB', 'Excel Solver', 'Arena Simulation']),
  ('ST 625', 'Quantitative Analysis for Business', 3, 'Statistical methods and quantitative techniques for business decision making.', ARRAY['R', 'SPSS', 'Minitab'])
) AS v(code, name, credits, description, tools)
WHERE sc.name = 'Bentley University' AND s.semester = 'Spring' AND s.year = 2024;

-- Add triggers for updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON public.awards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_semesters_updated_at BEFORE UPDATE ON public.semesters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();