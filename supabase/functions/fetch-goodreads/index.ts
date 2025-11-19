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
    
    // Fetch Goodreads RSS feed for "read" shelf to get book IDs
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
        
        // Extract read date from RSS
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
        
        console.log(`Fetching book page for ID: ${goodreadsId}`);
        
        // Fetch individual book page for accurate data
        const bookPageUrl = `https://www.goodreads.com/book/show/${goodreadsId}`;
        const bookPageResponse = await fetch(bookPageUrl);
        const bookPageHtml = await bookPageResponse.text();
        
        // Parse the book page HTML
        const bookDoc = parser.parseFromString(bookPageHtml, 'text/html');
        if (!bookDoc) {
          console.log(`Failed to parse book page for ${goodreadsId}`);
          continue;
        }
        
        // Extract title from h1 with data-testid="bookTitle"
        const titleEl = bookDoc.querySelector('h1[data-testid="bookTitle"]');
        const title = titleEl?.textContent?.trim() || '';
        
        // Extract author from span with data-testid="name"
        const authorEl = bookDoc.querySelector('span[data-testid="name"]');
        const author = authorEl?.textContent?.trim() || '';
        
        // Skip books without title or author
        if (!title || !author) {
          console.log(`Skipping book ${goodreadsId} - missing title or author`);
          continue;
        }
        
        // Extract genres - look for buttons with class containing "BookPageMetadataSection__genreButton"
        const genreButtons = bookDoc.querySelectorAll('button[class*="BookPageMetadataSection__genreButton"]');
        let genre = null;
        
        for (const button of genreButtons) {
          const genreText = button.textContent?.trim().toLowerCase() || '';
          console.log(`Found genre: ${genreText}`);
          
          if (genreText.includes('classics') || genreText.includes('classic')) {
            genre = 'Classics';
            break;
          } else if (genreText.includes('business')) {
            genre = 'Business';
            break;
          }
        }
        
        // Skip books that don't match our genre filter
        if (!genre) {
          console.log(`Skipping "${title}" - not in Classics or Business genre`);
          continue;
        }
        
        // Extract cover image
        const coverEl = bookDoc.querySelector('img[class*="ResponsiveImage"]');
        const coverUrl = coverEl?.getAttribute('src') || null;
        
        console.log(`✓ Added: ${title} by ${author} (${genre})`);
        
        books.push({
          goodreads_id: goodreadsId,
          title: title,
          author: author,
          cover_url: coverUrl,
          read_date: readDate,
          goodreads_url: bookPageUrl,
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
