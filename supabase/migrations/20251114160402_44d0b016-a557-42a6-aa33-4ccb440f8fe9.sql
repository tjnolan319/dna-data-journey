-- Create table for recent movies from Letterboxd
CREATE TABLE IF NOT EXISTS public.recent_movies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tmdb_id text NOT NULL,
  title text NOT NULL,
  director text,
  poster_url text,
  watched_date timestamp with time zone,
  letterboxd_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for recent books from Goodreads
CREATE TABLE IF NOT EXISTS public.recent_books (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goodreads_id text NOT NULL,
  title text NOT NULL,
  author text,
  cover_url text,
  read_date timestamp with time zone,
  goodreads_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recent_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_books ENABLE ROW LEVEL SECURITY;

-- Public can view recent movies and books
CREATE POLICY "Public can view recent movies"
  ON public.recent_movies
  FOR SELECT
  USING (true);

CREATE POLICY "Public can view recent books"
  ON public.recent_books
  FOR SELECT
  USING (true);

-- Admin can manage recent movies and books
CREATE POLICY "Admin can manage recent movies"
  ON public.recent_movies
  FOR ALL
  USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

CREATE POLICY "Admin can manage recent books"
  ON public.recent_books
  FOR ALL
  USING ((auth.jwt() ->> 'email'::text) = 'tjnolan319@gmail.com'::text);

-- Create triggers for updated_at
CREATE TRIGGER update_recent_movies_updated_at
  BEFORE UPDATE ON public.recent_movies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recent_books_updated_at
  BEFORE UPDATE ON public.recent_books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();