-- WHAT SUPABASE GIVES YOU FOR FREE, recreated so it runs on plain Postgres. On a real Supabase project this
-- already exists, so you would NOT include this file in your migrations there.

create schema auth;

-- Supabase keeps its login accounts in auth.users.
create table auth.users (
  id     uuid primary key default gen_random_uuid(),
  email  text not null unique
);

-- Every request arrives with a signed token (a JWT) from the person who logged in. Supabase unpacks it into the
-- setting 'request.jwt.claims' for the length of that request, and auth.uid() reads the user's id out of it.
-- That one function is what row-level security policies lean on.
create function auth.uid() returns uuid
  language sql stable
  as $$ select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid $$;

-- Two database roles. 'anon' is a visitor who hasn't logged in, 'authenticated' is someone who has.
-- (The all-powerful "service role" is the database owner, which skips row-level security. Never ship it to a browser.)
create role anon nologin;
create role authenticated nologin;
grant usage on schema public to anon, authenticated;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;

-- Supabase hands both roles every right on every public table, and leaves the safety to row-level security.
-- So the policies in migration 002 are the ONLY thing standing between a visitor and your data.
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;
