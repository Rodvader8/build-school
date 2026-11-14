-- Row Level Security: the database itself decides which rows each signed-in user may touch.
-- Rules for this file, for every table in schema.sql:
--   1. alter table public.<name> enable row level security;
--   2. a policy for each action the app needs (select, insert, update, delete)
--   3. every policy compares the row's owner to auth.uid(). Never "using (true)" on anything that writes.
-- Without RLS anyone holding the public anon key can read every row. With it on and no policy, nobody can.

alter table public.profiles enable row level security;
create policy "profiles: read own" on public.profiles for select using (id = auth.uid());
