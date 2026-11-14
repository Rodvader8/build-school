Here's the question every client with more than one customer eventually asks: "can they see each other's data?" On a dashboard where each client logs in and sees their own numbers, the honest answer has to be "no, and the database makes sure of it". A good client portal works that way, and this lesson builds the mechanism behind it.

## Don't filter in the app

The obvious approach is `where org_id = <the user's org>` in every query. It works until someone forgets it once, in one query, on one page. Or an attacker calls your database directly and writes their own query.

**Row-level security (RLS)** moves the rule into the database. You declare, per table, which rows each user may see or change. Then **every** query, however it's written and whoever sends it, gets those rules applied automatically. Forget a filter in the app and nothing leaks.

## How login reaches the database

On Supabase the flow is:

1. The person logs in. Supabase checks their password and returns a signed **token** (a JWT).
2. Every request the client sends carries that token.
3. Supabase unpacks the token into a setting, `request.jwt.claims`, for the length of that request.
4. `auth.uid()` reads the user's id out of that setting. **Policies are written in terms of `auth.uid()`.**

`db/migrations/000_supabase_shim.sql` recreates that machinery so it runs on PGlite: an `auth.users` table, `auth.uid()`, and the two database roles, `anon` (not logged in) and `authenticated` (logged in). On a real project you'd get all of it for free. `src/session.js` plays the part of step 3, so tests can act as any user. `src/supabase.js` shows the real client calls.

## Memberships

Which organisation does a user belong to? A `memberships` table: one row per person per organisation. That's how Carol, who looks after two clients, sees both while Alice and Bob see one each.

## Policies

```sql
alter table venues enable row level security;

create policy "venues: own organisations" on venues
  for all to authenticated
  using      (org_id in (select auth_org_ids()))
  with check (org_id in (select auth_org_ids()));
```

- `enable row level security` locks the table. With no policy, **nobody** gets any rows. Safe by default.
- `to authenticated` means visitors who aren't logged in match nothing.
- `using` decides which *existing* rows you can see, update or delete.
- `with check` decides what you're allowed to *write*. Without it, a user could insert a row into someone else's organisation, or move their own row across.
- A policy with `using (true)` is a door with no lock. It's the classic mistake, and one of the checks looks for it.

Policies apply to the `authenticated` and `anon` roles. The database owner, which is what Supabase calls the **service role**, skips them entirely. That's what your backend jobs use, and it's why that key must **never** reach a browser. Anything with the anon key is limited by your policies, and anything with the service key isn't.

## Proving it

The tests act as Alice, Bob, Carol and a stranger, and throw crafted queries at the database: `... or true`, a `union`, a join, an update that tries to move a row across organisations. Isolation isn't something you believe, it's something you try to break.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. Click through Alice, Bob and "Not logged in". Look at the crafted-query panel: right now it returns 7 rows, Kestrel's included. That's the leak.
2. Open `tests/rls.test.js`.
3. In `db/migrations/002_rls.sql`, switch on RLS for `daily_sales`.
4. Add the policy for `venues`, and rewrite the `daily_sales` one so it checks organisations and covers every kind of write.
5. Refresh the preview and watch Alice's crafted query drop to 6 rows.
6. Press **Check my work**.

> Tip: to point this at a real Supabase project, run migrations 001 and 002 in its SQL editor (skip 000, because Supabase provides it), put the URL and anon key in `.env`, and call `signIn()` from `src/supabase.js`. The queries, and the isolation, come across unchanged.
