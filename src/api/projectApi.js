const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper function to check configuration
function checkSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration. Please check your GitHub Secrets.');
  }
}

// Helper function to make API requests
async function makeSupabaseRequest(endpoint) {
  checkSupabaseConfig();
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
  }
  
  return await response.json();
}

// Projects API
export async function fetchProjects() {
  return await makeSupabaseRequest('projects?select=*&or=(status.neq.DRAFT,status.is.null)');
}

// Case Studies API
export async function fetchCaseStudies() {
  return await makeSupabaseRequest('case_studies?select=*&or=(status.neq.DRAFT,status.is.null)');
}

// Dashboards API
export async function fetchDashboards() {
  return await makeSupabaseRequest('dashboards?select=*&or=(status.neq.DRAFT,status.is.null)');
}

// Publications API
export async function fetchPublications() {
  return await makeSupabaseRequest('publications?select=*&or=(status.neq.DRAFT,status.is.null)');
}

// Certifications API
export async function fetchCertifications() {
  return await makeSupabaseRequest('certifications?select=*&or=(status.neq.DRAFT,status.is.null)');
}
