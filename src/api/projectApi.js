const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchProjects() {
  // Check if secrets are configured
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration. Please check your GitHub Secrets.');
  }
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching projects: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}
