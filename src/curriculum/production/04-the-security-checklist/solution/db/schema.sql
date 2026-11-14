-- The tables behind the app. Provided for you. Your job is db/policies.sql.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null
);

create table public.notes (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users on delete cascade,
  body text not null,
  shared boolean not null default false
);

create table public.invoices (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users on delete cascade,
  amount_cents integer not null check (amount_cents >= 0)
);
