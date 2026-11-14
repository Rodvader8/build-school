-- Migration 001: the tables the dashboard reads from.
-- A migration is a SQL file that's run once, in order, to move the database from one shape to the next.

create table orgs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- TODO: a venue belongs to exactly one organisation. org_id must be required (not null) and point at orgs (id),
-- and deleting an organisation should delete its venues (on delete cascade).
create table venues (
  id      uuid primary key default gen_random_uuid(),
  org_id  uuid,
  name    text not null,
  suburb  text
);

-- TODO: create daily_sales.
--   id             a whole number the database numbers for you (bigint generated always as identity), the primary key
--   org_id         required, references orgs (id), on delete cascade
--   venue_id       required, references venues (id), on delete cascade
--   day            a date, required
--   revenue_cents  integer, required, never negative (check)
--   covers         integer, required, never negative (check)
--   and only one row per venue per day (unique on venue_id and day)
-- Then add an index on daily_sales (org_id, day), because every dashboard query filters on those two.
