-- Migration 002: row-level security. Every table is locked, then each policy opens exactly one door.
-- A policy is a rule the database checks on every row, on every query, whoever wrote the query.

alter table orgs        enable row level security;
alter table venues      enable row level security;
alter table daily_sales enable row level security;
alter table memberships enable row level security;

-- Which organisations does the signed-in user belong to? Used by every policy below.
-- (security definer: it reads memberships with its owner's rights, so the policy on memberships doesn't loop.)
create function auth_org_ids() returns setof uuid
  language sql stable security definer set search_path = public
  as $$ select org_id from memberships where user_id = auth.uid() $$;

-- People can see their own memberships, and nothing else's.
create policy "see own memberships" on memberships
  for select to authenticated
  using (user_id = auth.uid());

create policy "see own organisations" on orgs
  for select to authenticated
  using (id in (select auth_org_ids()));

-- venues and daily_sales: full access, but only inside your own organisations.
-- "using" decides which existing rows you can see, change or delete. "with check" decides what you may write.
create policy "venues: own organisations" on venues
  for all to authenticated
  using (org_id in (select auth_org_ids()))
  with check (org_id in (select auth_org_ids()));

create policy "sales: own organisations" on daily_sales
  for all to authenticated
  using (org_id in (select auth_org_ids()))
  with check (org_id in (select auth_org_ids()));
