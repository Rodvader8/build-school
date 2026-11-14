-- Migration 001: the tables, as in the last lesson, plus memberships: which user belongs to which organisation.

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

create table daily_sales (
  id             bigint generated always as identity primary key,
  org_id         uuid not null references orgs (id) on delete cascade,
  venue_id       uuid not null references venues (id) on delete cascade,
  day            date not null,
  revenue_cents  integer not null check (revenue_cents >= 0),
  covers         integer not null check (covers >= 0),
  unique (venue_id, day)
);
create index daily_sales_org_day_idx on daily_sales (org_id, day);

-- One row per person per organisation. This table is how the database knows who may see what.
create table memberships (
  user_id  uuid not null references auth.users (id) on delete cascade,
  org_id   uuid not null references orgs (id) on delete cascade,
  role     text not null default 'member',
  primary key (user_id, org_id)
);
