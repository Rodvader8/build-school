// How this looks against a real Supabase project. The tests never run this file: they use PGlite, so nothing
// here needs an account. It's here so you can see how little changes when you point the dashboard at the real thing.
import { createClient } from '@supabase/supabase-js';

// Keys come from the environment (a git-ignored .env file locally, the host's settings in production).
// They're never typed into the code. .env.example lists the names, with fake values.
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export function getSupabase() {
  if (!url || !anonKey) throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY. See .env.example.');
  return createClient(url, anonKey);
}

// The same question as findVenues() in queries.js, asked through Supabase's API instead of raw SQL.
export async function findVenuesRemote(orgId, search) {
  const { data, error } = await getSupabase()
    .from('venues')
    .select('id, name, suburb')
    .eq('org_id', orgId)
    .ilike('name', `%${search}%`)
    .order('name');
  if (error) throw error;
  return data;
}
