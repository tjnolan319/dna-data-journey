import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Film } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  director: string;
  poster_url: string | null;
  letterboxd_url: string | null;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  goodreads_url: string | null;
}

export const RecentMedia = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentMedia();
  }, []);

  const fetchRecentMedia = async () => {
    try {
      const { data: moviesData } = await supabase
        .from('recent_movies')
        .select('*')
        .order('watched_date', { ascending: false })
        .limit(4);

      const { data: booksData } = await supabase
        .from('recent_books')
        .select('*')
        .order('read_date', { ascending: false })
        .limit(4);

      setMovies(moviesData || []);
      setBooks(booksData || []);
    } catch (error) {
      console.error('Error fetching recent media:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (movies.length === 0 && books.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-8 py-8 border-t border-border/20">
      {movies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Recently Watched</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <a
                key={movie.id}
                href={movie.letterboxd_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-0">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                        <Film className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {movie.director}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {books.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Recently Read</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {books.map((book) => (
              <a
                key={book.id}
                href={book.goodreads_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                  <CardContent className="p-0">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full aspect-[2/3] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {book.author}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
