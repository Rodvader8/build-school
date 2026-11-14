import { openDb } from '../src/db.js';
import { asUser, asAnon } from '../src/session.js';

const ALICE = '11111111-1111-4111-8111-111111111111';
const BOB = '22222222-2222-4222-8222-222222222222';
const CAROL = '33333333-3333-4333-8333-333333333333';
const HARBOURLIGHT = 'a0000000-0000-4000-8000-000000000001';
const KESTREL = 'b0000000-0000-4000-8000-000000000002';
const KESTREL_VENUE = 'b1000000-0000-4000-8000-000000000001';
const HARBOUR_STREET = 'a1000000-0000-4000-8000-000000000001';

const rows = (sql, params = []) => (tx) => tx.query(sql, params).then((r) => r.rows);
const orgsOf = (list) => [...new Set(list.map((r) => r.org_id))];
const refused = async (promise, pattern) => {
  const error = await promise.then(() => null, (e) => e);
  expect(error, 'the database should have refused this').not.toBeNull();
  expect(error.message).toMatch(pattern);
};

describe('row-level security', () => {
  it('is switched on for every table', async () => {
    const db = await openDb({ seed: true });
    const { rows: tables } = await db.query(`select relname, relrowsecurity from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' order by relname`);
    expect(tables.map((t) => t.relname)).toEqual(['daily_sales', 'memberships', 'orgs', 'venues']);
    for (const t of tables) expect(t.relrowsecurity, `${t.relname} needs row-level security`).toBe(true);
  });

  it('a signed-in user sees only their own organisation\'s venues, sales and membership', async () => {
    const db = await openDb({ seed: true });
    const venues = await asUser(db, ALICE, rows('select name from venues order by name'));
    expect(venues.map((v) => v.name)).toEqual(['Harbour Street', 'Old Mill', 'Pier Kiosk']);
    const sales = await asUser(db, ALICE, rows('select org_id from daily_sales'));
    expect(sales).toHaveLength(6);
    expect(orgsOf(sales)).toEqual([HARBOURLIGHT]);
    expect((await asUser(db, ALICE, rows('select id from orgs'))).map((o) => o.id)).toEqual([HARBOURLIGHT]);
    expect((await asUser(db, ALICE, rows('select user_id from memberships'))).map((m) => m.user_id)).toEqual([ALICE]);
    expect((await asUser(db, BOB, rows('select name from venues'))).map((v) => v.name)).toEqual(['Kestrel Quay']);
  });

  it('another organisation stays invisible, however the query is written', async () => {
    const db = await openDb({ seed: true });
    const crafted = [
      `select * from daily_sales where org_id = '${KESTREL}'`,
      `select * from daily_sales where org_id = '${KESTREL}' or true`,
      `select * from daily_sales where venue_id = '${KESTREL_VENUE}'`,
      `select * from daily_sales union all select * from daily_sales where org_id = '${KESTREL}'`,
      `select s.* from daily_sales s join venues v on v.id = s.venue_id where v.name = 'Kestrel Quay'`,
      `select * from venues where org_id = '${KESTREL}' or 1 = 1`,
      `select * from daily_sales where org_id in (select id from orgs)`,
    ];
    for (const sql of crafted) {
      const result = await asUser(db, ALICE, rows(sql));
      expect(result.filter((r) => r.org_id === KESTREL), sql).toEqual([]);
    }
    const count = await asUser(db, ALICE, rows(`select count(*)::int as n from daily_sales where org_id = '${KESTREL}' or true`));
    expect(count[0].n).toBe(6);
  });

  it('the login accounts themselves are out of reach', async () => {
    const db = await openDb({ seed: true });
    await refused(asUser(db, ALICE, rows('select * from auth.users')), /permission denied/i);
  });

  it('a user can add sales to their own organisation', async () => {
    const db = await openDb({ seed: true });
    const added = await asUser(db, ALICE, rows(
      `insert into daily_sales (org_id, venue_id, day, revenue_cents, covers) values ($1, $2, '2026-03-01', 5000, 10) returning id`,
      [HARBOURLIGHT, HARBOUR_STREET],
    ));
    expect(added).toHaveLength(1);
  });

  it('a user can\'t add rows to, or move rows into, another organisation', async () => {
    const db = await openDb({ seed: true });
    await refused(
      asUser(db, ALICE, rows(`insert into daily_sales (org_id, venue_id, day, revenue_cents, covers) values ($1, $2, '2026-03-01', 1, 1)`, [KESTREL, KESTREL_VENUE])),
      /row-level security/i,
    );
    await refused(asUser(db, ALICE, rows(`insert into venues (org_id, name) values ($1, 'Sneaky')`, [KESTREL])), /row-level security/i);
    await refused(asUser(db, ALICE, rows(`update daily_sales set org_id = $1 where venue_id = $2`, [KESTREL, HARBOUR_STREET])), /row-level security/i);
  });

  it('a user can\'t change or delete another organisation\'s rows', async () => {
    const db = await openDb({ seed: true });
    expect(await asUser(db, ALICE, rows(`update daily_sales set revenue_cents = 0 where org_id = $1 returning id`, [KESTREL]))).toEqual([]);
    expect(await asUser(db, ALICE, rows(`delete from daily_sales where org_id = $1 returning id`, [KESTREL]))).toEqual([]);
    expect(await asUser(db, ALICE, rows(`delete from venues where org_id = $1 returning id`, [KESTREL]))).toEqual([]);
    const { rows: left } = await db.query(`select sum(revenue_cents)::int as total from daily_sales where org_id = $1`, [KESTREL]);
    expect(left[0].total).toBe(500000);
  });

  it('someone who isn\'t logged in sees nothing and can change nothing', async () => {
    const db = await openDb({ seed: true });
    for (const table of ['orgs', 'venues', 'daily_sales', 'memberships']) {
      expect(await asAnon(db, rows(`select * from ${table}`)), table).toEqual([]);
    }
    await refused(asAnon(db, rows(`insert into venues (org_id, name) values ($1, 'Visitor')`, [HARBOURLIGHT])), /row-level security|permission denied/i);
  });

  it('a user in two organisations sees both', async () => {
    const db = await openDb({ seed: true });
    const sales = await asUser(db, CAROL, rows('select org_id from daily_sales'));
    expect(orgsOf(sales).sort()).toEqual([HARBOURLIGHT, KESTREL]);
    expect(await asUser(db, CAROL, rows('select id from venues'))).toHaveLength(4);
  });

  it('the database owner (the "service role") still sees everything', async () => {
    const db = await openDb({ seed: true });
    const { rows: all } = await db.query('select count(*)::int as n from daily_sales');
    expect(all[0].n).toBe(7);
  });
});
