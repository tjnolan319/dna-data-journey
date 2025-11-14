import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Fetching Letterboxd RSS feed...');
    
    // Fetch Letterboxd RSS feed
    const letterboxdRss = await fetch('https://letterboxd.com/Tjnolan3/rss/');
    const rssText = await letterboxdRss.text();
    
    // Parse XML to extract movie data
    const movieMatches = [...rssText.matchAll(/<item>[\s\S]*?<\/item>/g)];
    const movies = [];
    
    for (const match of movieMatches.slice(0, 4)) {
      const itemXml = match[0];
      
      // Extract TMDb ID
      const tmdbMatch = itemXml.match(/<tmdb:movieId>(\d+)<\/tmdb:movieId>/);
      if (!tmdbMatch) continue;
      
      const tmdbId = tmdbMatch[1];
      
      // Extract watched date
      const dateMatch = itemXml.match(/<letterboxd:watchedDate>(.*?)<\/letterboxd:watchedDate>/);
      const watchedDate = dateMatch ? new Date(dateMatch[1]) : null;
      
      // Extract Letterboxd URL
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const letterboxdUrl = linkMatch ? linkMatch[1] : null;
      
      console.log(`Fetching TMDb data for movie ${tmdbId}...`);
      
      // Fetch movie details from TMDb
      const tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&append_to_response=credits`
      );
      
      if (!tmdbResponse.ok) {
        console.error(`Failed to fetch TMDb data for ${tmdbId}`);
        continue;
      }
      
      const tmdbData = await tmdbResponse.json();
      
      // Get director from credits
      const director = tmdbData.credits?.crew?.find((person: any) => person.job === 'Director')?.name || '';
      
      movies.push({
        tmdb_id: tmdbId,
        title: tmdbData.title,
        director: director,
        poster_url: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null,
        watched_date: watchedDate?.toISOString() || null,
        letterboxd_url: letterboxdUrl,
      });
    }
    
    console.log(`Found ${movies.length} movies`);
    
    // Delete old movies and insert new ones
    const { error: deleteError } = await supabase
      .from('recent_movies')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('Error deleting old movies:', deleteError);
    }
    
    if (movies.length > 0) {
      const { error: insertError } = await supabase
        .from('recent_movies')
        .insert(movies);
      
      if (insertError) {
        console.error('Error inserting movies:', insertError);
        throw insertError;
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, count: movies.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-letterboxd:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
