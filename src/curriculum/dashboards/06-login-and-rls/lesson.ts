import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Login and row-level security',
  minutes: 75,
  kind: 'project',
  entry: 'db/migrations/002_rls.sql',
  checkEntry: 'check.mjs',
  devPort: 4856,
  devCommand: 'node server.mjs 4856',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'is switched on for every table',
    'a signed-in user sees only their own organisation\'s venues, sales and membership',
    'another organisation stays invisible, however the query is written',
    'the login accounts themselves are out of reach',
    'a user can add sales to their own organisation',
    'a user can\'t add rows to, or move rows into, another organisation',
    'a user can\'t change or delete another organisation\'s rows',
    'someone who isn\'t logged in sees nothing and can change nothing',
    'a user in two organisations sees both',
    'the database owner (the "service role") still sees everything',
    'every policy names who it is for (to authenticated)',
    'no policy says "using (true)", which opens a table to everyone',
    'write policies have a "with check" so users can\'t write into other organisations',
    '.env.example holds fake values, and .env is git-ignored',
    'the service role key is never used in this code',
  ]),
  hints: [
    'First, the missing line: alter table daily_sales enable row level security. A policy on a table without RLS switched on is ignored, so the table stays wide open.',
    'One policy per table covers everything: create policy "venues: own organisations" on venues for all to authenticated using (org_id in (select auth_org_ids())) with check (org_id in (select auth_org_ids())). "using" filters what you can see, change or delete. "with check" limits what you can write.',
    'Use the preview: pick Alice, then Bob, then Not logged in. The "crafted query" panel runs "or true" against Kestrel\'s sales. With the right policies, Alice gets back only her own 6 rows, never Kestrel\'s.',
  ],
} satisfies LessonMeta;
