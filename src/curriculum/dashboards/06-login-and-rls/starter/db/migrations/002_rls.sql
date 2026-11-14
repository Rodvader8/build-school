-- Migration 002: row-level security. Every table is locked, then each policy opens exactly one door.
-- A policy is a rule the database checks on every row, on every query, whoever wrote the query.

alter table orgs        enable row level security;
alter table venues      enable row level security;
-- TODO: daily_sales is missing from this list. Without it, its policies do nothing at all.
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

-- TODO: venues has RLS switched on but no policy, so nobody can see a thing. Add one policy "for all to authenticated"
-- whose "using" and "with check" both say: org_id in (select auth_org_ids()).

-- TODO: this policy lets every signed-in user read every organisation's sales. Replace "true" with the same
-- organisation rule, and make it cover insert, update and delete as well (for all, using AND with check).
create policy "sales: anyone signed in" on daily_sales
  for select to authenticated
  using (true);
