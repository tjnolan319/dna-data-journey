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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Fetching Goodreads RSS feed...');
    
    // Fetch Goodreads RSS feed for "read" shelf
    const goodreadsRss = await fetch('https://www.goodreads.com/review/list_rss/179633369?shelf=read');
    const rssText = await goodreadsRss.text();
    
    // Parse XML to extract book data
    const itemMatches = [...rssText.matchAll(/<item>[\s\S]*?<\/item>/g)];
    const books = [];
    
    for (const match of itemMatches.slice(0, 4)) {
      const itemXml = match[0];
      
      // Extract book ID
      const bookIdMatch = itemXml.match(/<book_id>(\d+)<\/book_id>/);
      if (!bookIdMatch) continue;
      
      const goodreadsId = bookIdMatch[1];
      
      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const title = titleMatch ? titleMatch[1] : '';
      
      // Extract author
      const authorMatch = itemXml.match(/<author_name><!\[CDATA\[(.*?)\]\]><\/author_name>/);
      const author = authorMatch ? authorMatch[1] : '';
      
      // Extract cover image
      const coverMatch = itemXml.match(/<book_large_image_url><!\[CDATA\[(.*?)\]\]><\/book_large_image_url>/);
      const coverUrl = coverMatch ? coverMatch[1] : null;
      
      // Extract link
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const goodreadsUrl = linkMatch ? linkMatch[1] : null;
      
      // Extract published date (user read date)
      const dateMatch = itemXml.match(/<user_read_at>(.*?)<\/user_read_at>/);
      let readDate = null;
      if (dateMatch && dateMatch[1]) {
        try {
          const parsedDate = new Date(dateMatch[1]);
          if (!isNaN(parsedDate.getTime())) {
            readDate = parsedDate.toISOString();
          }
        } catch (e) {
          console.log('Failed to parse date:', dateMatch[1]);
        }
      }
      
      console.log(`Found book: ${title} by ${author}`);
      
      books.push({
        goodreads_id: goodreadsId,
        title: title,
        author: author,
        cover_url: coverUrl,
        read_date: readDate,
        goodreads_url: goodreadsUrl,
      });
    }
    
    console.log(`Found ${books.length} books`);
    
    // Delete old books and insert new ones
    const { error: deleteError } = await supabase
      .from('recent_books')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('Error deleting old books:', deleteError);
    }
    
    if (books.length > 0) {
      const { error: insertError } = await supabase
        .from('recent_books')
        .insert(books);
      
      if (insertError) {
        console.error('Error inserting books:', insertError);
        throw insertError;
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, count: books.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-goodreads:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
