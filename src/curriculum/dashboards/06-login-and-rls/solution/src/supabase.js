// How login looks against a real Supabase project. The tests never run this file: they use PGlite and src/session.js.
import { createClient } from '@supabase/supabase-js';

// Keys come from the environment, never from the code. See .env.example.
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export function getSupabase() {
  if (!url || !anonKey) throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY. See .env.example.');
  return createClient(url, anonKey);
}

// 1. The person logs in. Supabase checks the password and hands back a session holding a signed token (a JWT).
export async function signIn(email, password) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

// 2. From then on, every request the client makes carries that token. Supabase unpacks it into
//    request.jwt.claims, auth.uid() returns the user's id, and your policies do the rest.
//    So this query needs no "where org_id = ..." at all: the database only hands back the caller's own rows.
export async function myVenues(supabase) {
  const { data, error } = await supabase.from('venues').select('id, name, suburb').order('name');
  if (error) throw error;
  return data;
}
