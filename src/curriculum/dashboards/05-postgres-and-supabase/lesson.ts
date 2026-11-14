import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Postgres and Supabase',
  minutes: 70,
  kind: 'project',
  entry: 'db/migrations/001_init.sql',
  checkEntry: 'check.mjs',
  devPort: 4855,
  devCommand: 'node server.mjs 4855',
  testSetup: 'npm install --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund',
  checks: outputChecks([
    'the migration creates orgs, venues and daily_sales',
    'every table has a primary key, and venues and sales point at their parents',
    'a venue can\'t exist without a real organisation',
    'revenue and covers can\'t be negative',
    'there is one sales row per venue per day',
    'deleting an organisation removes its venues and sales',
    'there is an index for looking up sales by organisation and day',
    'revenueByVenue totals each venue for one organisation, biggest first',
    'monthlyRevenue groups by month, oldest first',
    'findVenues matches names in any case, within one organisation',
    'findVenues uses parameters, so a crafted search can\'t touch the tables',
    '.env.example lists the keys with fake values, and .env is git-ignored',
    'the Supabase client reads its keys from the environment',
    'the queries use parameters, never string-built SQL',
    'money is stored as integer cents, not floating point',
  ]),
  hints: [
    'Finish venues first: org_id uuid not null references orgs (id) on delete cascade. Then daily_sales follows the same pattern for both of its foreign keys. The check constraints are check (revenue_cents >= 0), and unique (venue_id, day) goes at the end of the column list.',
    'revenueByVenue: select v.name as venue, sum(s.revenue_cents)::int as revenue_cents from daily_sales s join venues v on v.id = s.venue_id where s.org_id = $1 group by v.name order by revenue_cents desc, then db.query(sql, [orgId]) and return rows.',
    'findVenues matches with name ilike \'%\' || $2 || \'%\'. The search text is the second parameter, so db.query(sql, [orgId, search]). If you ever catch yourself writing ${search} inside the SQL, stop: that\'s how injection happens.',
  ],
} satisfies LessonMeta;
