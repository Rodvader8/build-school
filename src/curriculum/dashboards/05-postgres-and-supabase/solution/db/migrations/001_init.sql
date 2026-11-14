-- Migration 001: the tables the dashboard reads from.
-- A migration is a SQL file that's run once, in order, to move the database from one shape to the next.

create table orgs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

create table venues (
  id      uuid primary key default gen_random_uuid(),
  org_id  uuid not null references orgs (id) on delete cascade,
  name    text not null,
  suburb  text
);

-- Money is stored as whole cents, so there's no 0.1 + 0.2 rounding trouble.
create table daily_sales (
  id             bigint generated always as identity primary key,
  org_id         uuid not null references orgs (id) on delete cascade,
  venue_id       uuid not null references venues (id) on delete cascade,
  day            date not null,
  revenue_cents  integer not null check (revenue_cents >= 0),
  covers         integer not null check (covers >= 0),
  unique (venue_id, day)
);

-- The dashboard always asks "this organisation, over these days", so index exactly that.
create index daily_sales_org_day_idx on daily_sales (org_id, day);
