Every dashboard you've built so far read its numbers from a file. Real clients have real databases, and for most of the dashboards you'll build that database is **Postgres**, usually through **Supabase**. It's the data layer behind a lot of client portals.

## Postgres, Supabase, PGlite

- **Postgres** is the database. Tables of rows, queried with SQL.
- **Supabase** is Postgres plus the extras you'd otherwise build yourself: a ready-made API, logins and file storage. The SQL you write for it is plain Postgres.
- **PGlite** is Postgres compiled to WebAssembly, running inside your Node process. It's real Postgres with no account, no Docker and no network, so you can learn and test the exact SQL you'd run on Supabase.

Everything in this lesson and the next runs on PGlite. You'll also see the Supabase client code, so you know how it connects, but it never runs here.

## Tables and constraints

A table is a promise about the shape of your data, and **constraints** make the database keep the promise even when your code has a bug:

```sql
create table venues (
  id      uuid primary key default gen_random_uuid(),
  org_id  uuid not null references orgs (id) on delete cascade,
  name    text not null
);
```

- `primary key`: every row is uniquely identifiable.
- `not null` and `references`: a venue can't exist without an organisation, and the organisation must be real. That's a **foreign key**.
- `on delete cascade`: remove an organisation and its venues go too, instead of being left behind.
- `check (revenue_cents >= 0)` and `unique (venue_id, day)`: negative takings and double-counted days are refused outright.

Store money as **whole cents** in an `integer`. Floating point can't hold 0.1 exactly.

## A migration

A **migration** is a numbered SQL file (`001_init.sql`) that moves the database from one shape to the next. They run in order and are committed with your code, so every copy of the database, yours, a teammate's, production, ends up identical. `src/db.js` runs everything in `db/migrations` each time it opens a database.

An **index** (`create index ... on daily_sales (org_id, day)`) is a sorted lookup table. Dashboards always ask "this organisation, over these days", so that's the one to build.

## Queries, and never gluing strings

```js
await db.query('select * from venues where org_id = $1', [orgId]);
```

The `$1` marks where a value goes, and the array supplies it. The database receives the SQL and the values separately, so a value can never turn into SQL. Gluing `${search}` into the string is **SQL injection**, one of the oldest and costliest bugs there is. One of the tests throws `'; drop table venues; --` at your search function to prove you haven't made that mistake.

## The same thing on Supabase

`src/supabase.js` shows the client. Notice the keys: they come from `process.env`, are listed with fake values in `.env.example`, and the real ones live in a git-ignored `.env`. To use a real project you'd create it in Supabase, paste your migration into its SQL editor, copy the URL and anon key into `.env`, and nothing else changes.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. It shows your tables and query results, and prints SQL errors in red.
2. Open `tests/db.test.js`.
3. In `db/migrations/001_init.sql`, finish `venues` and create `daily_sales` and its index. Refresh the preview after each save to see the tables appear.
4. In `src/queries.js`, write the three queries with parameters.
5. Press **Check my work**.

> Tip: when a query returns something odd, run it in the preview page's "Revenue by venue" panel by editing the function, saving and refreshing. A fresh database every time means you can't break anything.
