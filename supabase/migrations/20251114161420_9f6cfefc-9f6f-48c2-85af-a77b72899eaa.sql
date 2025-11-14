-- Schedule weekly Letterboxd fetch (every Sunday at midnight EST)
SELECT cron.schedule(
  'fetch-letterboxd-weekly',
  '0 5 * * 0',
  $$
  SELECT
    net.http_post(
      url:='https://mlrfleeflqqfacrknnzf.supabase.co/functions/v1/fetch-letterboxd',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scmZsZWVmbHFxZmFjcmtubnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTMzMjcsImV4cCI6MjA2NzA4OTMyN30.w01nrhu491Q7eSK1TxjZopUwPwLZCIaCtqlg30VR0a0"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Schedule weekly Goodreads fetch (every Sunday at midnight EST)
SELECT cron.schedule(
  'fetch-goodreads-weekly',
  '0 5 * * 0',
  $$
  SELECT
    net.http_post(
      url:='https://mlrfleeflqqfacrknnzf.supabase.co/functions/v1/fetch-goodreads',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scmZsZWVmbHFxZmFjcmtubnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTMzMjcsImV4cCI6MjA2NzA4OTMyN30.w01nrhu491Q7eSK1TxjZopUwPwLZCIaCtqlg30VR0a0"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);