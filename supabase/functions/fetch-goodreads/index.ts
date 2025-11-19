import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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
    
    console.log('Parsing RSS feed with DOMParser...');
    
    // Parse XML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(rssText, 'text/xml');
    
    if (!doc) {
      throw new Error('Failed to parse RSS feed');
    }
    
    const items = doc.querySelectorAll('item');
    console.log(`Found ${items.length} total items in feed`);
    
    const books = [];
    
    for (const item of items) {
      try {
        // Extract book ID
        const bookIdEl = item.querySelector('book_id');
        if (!bookIdEl || !bookIdEl.textContent) continue;
        const goodreadsId = bookIdEl.textContent.trim();
        
        // Extract title
        const titleEl = item.querySelector('title');
        const title = titleEl?.textContent?.trim() || '';
        
        // Extract author
        const authorEl = item.querySelector('author_name');
        const author = authorEl?.textContent?.trim() || '';
        
        // Skip books without title or author
        if (!title || !author) {
          console.log(`Skipping book ${goodreadsId} - missing title or author`);
          continue;
        }
        
        // Extract shelves/genres
        const shelvesEl = item.querySelector('user_shelves');
        const shelves = shelvesEl?.textContent?.trim().toLowerCase() || '';
        
        console.log(`Book: "${title}" by ${author} - shelves: "${shelves}"`);
        
        // Determine genre - check for Classics or Business
        let genre = null;
        if (shelves.includes('classics') || shelves.includes('classic')) {
          genre = 'Classics';
        } else if (shelves.includes('business')) {
          genre = 'Business';
        }
        
        // Skip books that don't match our genre filter
        if (!genre) {
          console.log(`Skipping "${title}" - not in Classics or Business genre`);
          continue;
        }
        
        // Extract cover image
        const coverEl = item.querySelector('book_large_image_url');
        const coverUrl = coverEl?.textContent?.trim() || null;
        
        // Extract link
        const linkEl = item.querySelector('link');
        const goodreadsUrl = linkEl?.textContent?.trim() || null;
        
        // Extract read date
        const dateEl = item.querySelector('user_read_at');
        let readDate = null;
        if (dateEl && dateEl.textContent) {
          try {
            const parsedDate = new Date(dateEl.textContent.trim());
            if (!isNaN(parsedDate.getTime())) {
              readDate = parsedDate.toISOString();
            }
          } catch (e) {
            console.log('Failed to parse date:', dateEl.textContent);
          }
        }
        
        console.log(`✓ Added: ${title} by ${author} (${genre})`);
        
        books.push({
          goodreads_id: goodreadsId,
          title: title,
          author: author,
          cover_url: coverUrl,
          read_date: readDate,
          goodreads_url: goodreadsUrl,
          genre: genre,
        });
        
        // Stop once we have 4 books that match our criteria
        if (books.length >= 4) break;
      } catch (error) {
        console.error('Error processing item:', error);
        continue;
      }
    }
    
    console.log(`Successfully parsed ${books.length} books`);
    
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
      JSON.stringify({ success: true, count: books.length, books: books }),
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
