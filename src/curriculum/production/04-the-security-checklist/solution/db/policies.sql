-- Row Level Security: the database itself decides which rows each signed-in user may touch.
-- Without it, anyone holding the public anon key can read every row. With it, no rule means no access.

alter table public.profiles enable row level security;
create policy "profiles: read own" on public.profiles for select using (id = auth.uid());
create policy "profiles: update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

alter table public.notes enable row level security;
create policy "notes: read own or shared" on public.notes for select using (owner = auth.uid() or shared);
create policy "notes: insert own" on public.notes for insert with check (owner = auth.uid());
create policy "notes: update own" on public.notes for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "notes: delete own" on public.notes for delete using (owner = auth.uid());

alter table public.invoices enable row level security;
create policy "invoices: read own" on public.invoices for select using (owner = auth.uid());
