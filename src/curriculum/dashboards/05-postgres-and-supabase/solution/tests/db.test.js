import { randomUUID } from 'node:crypto';
import { openDb } from '../src/db.js';
import { revenueByVenue, monthlyRevenue, findVenues } from '../src/queries.js';

const HARBOURLIGHT = 'a0000000-0000-4000-8000-000000000001';
const KESTREL = 'b0000000-0000-4000-8000-000000000002';
const HARBOUR_STREET = 'a1000000-0000-4000-8000-000000000001';

const names = async (db, sql, params = []) => (await db.query(sql, params)).rows.map((r) => Object.values(r)[0]);
const rejects = async (promise, pattern) => {
  const error = await promise.then(() => null, (e) => e);
  expect(error, 'the database should have refused this').not.toBeNull();
  expect(error.message).toMatch(pattern);
};

describe('the tables', () => {
  it('the migration creates orgs, venues and daily_sales', async () => {
    const db = await openDb();
    const tables = await names(db, `select table_name from information_schema.tables where table_schema = 'public'`);
    expect(tables).toEqual(expect.arrayContaining(['orgs', 'venues', 'daily_sales']));
  });

  it('every table has a primary key, and venues and sales point at their parents', async () => {
    const db = await openDb();
    const { rows } = await db.query(
      `select conrelid::regclass::text as tbl, contype, pg_get_constraintdef(oid) as def from pg_constraint where connamespace = 'public'::regnamespace`,
    );
    const has = (tbl, type, text = '') => rows.some((r) => r.tbl === tbl && r.contype === type && r.def.includes(text));
    for (const tbl of ['orgs', 'venues', 'daily_sales']) expect(has(tbl, 'p'), `${tbl} needs a primary key`).toBe(true);
    expect(has('venues', 'f', 'REFERENCES orgs')).toBe(true);
    expect(has('daily_sales', 'f', 'REFERENCES venues')).toBe(true);
    expect(has('daily_sales', 'f', 'REFERENCES orgs')).toBe(true);
  });

  it('a venue can\'t exist without a real organisation', async () => {
    const db = await openDb();
    await rejects(db.query(`insert into venues (name) values ('Orphan')`), /null value|not-null/i);
    await rejects(db.query(`insert into venues (org_id, name) values ($1, 'Ghost')`, [randomUUID()]), /foreign key/i);
  });

  it('revenue and covers can\'t be negative', async () => {
    const db = await openDb({ seed: true });
    const insert = (revenue, covers) =>
      db.query(`insert into daily_sales (org_id, venue_id, day, revenue_cents, covers) values ($1, $2, '2026-03-01', $3, $4)`, [HARBOURLIGHT, HARBOUR_STREET, revenue, covers]);
    await rejects(insert(-1, 10), /check constraint/i);
    await rejects(insert(100, -5), /check constraint/i);
  });

  it('there is one sales row per venue per day', async () => {
    const db = await openDb({ seed: true });
    await rejects(
      db.query(`insert into daily_sales (org_id, venue_id, day, revenue_cents, covers) values ($1, $2, '2026-01-31', 1, 1)`, [HARBOURLIGHT, HARBOUR_STREET]),
      /unique|duplicate/i,
    );
  });

  it('deleting an organisation removes its venues and sales', async () => {
    const db = await openDb({ seed: true });
    await db.query('delete from orgs where id = $1', [KESTREL]);
    expect(await names(db, 'select count(*)::int from venues where org_id = $1', [KESTREL])).toEqual([0]);
    expect(await names(db, 'select count(*)::int from daily_sales where org_id = $1', [KESTREL])).toEqual([0]);
    expect(await names(db, 'select count(*)::int from venues')).toEqual([3]);
  });

  it('there is an index for looking up sales by organisation and day', async () => {
    const db = await openDb();
    const { rows } = await db.query(`select indexdef from pg_indexes where schemaname = 'public' and tablename = 'daily_sales' and indexdef not ilike '%unique%'`);
    expect(rows.some((r) => /\(org_id, day\)/.test(r.indexdef))).toBe(true);
  });
});

describe('the queries', () => {
  it('revenueByVenue totals each venue for one organisation, biggest first', async () => {
    const db = await openDb({ seed: true });
    expect(await revenueByVenue(db, HARBOURLIGHT)).toEqual([
      { venue: 'Harbour Street', revenue_cents: 360000 },
      { venue: 'Old Mill', revenue_cents: 150000 },
      { venue: 'Pier Kiosk', revenue_cents: 30000 },
    ]);
    expect(await revenueByVenue(db, KESTREL)).toEqual([{ venue: 'Kestrel Quay', revenue_cents: 500000 }]);
  });

  it('monthlyRevenue groups by month, oldest first', async () => {
    const db = await openDb({ seed: true });
    expect(await monthlyRevenue(db, HARBOURLIGHT)).toEqual([
      { month: '2026-01', revenue_cents: 350000 },
      { month: '2026-02', revenue_cents: 190000 },
    ]);
  });

  it('findVenues matches names in any case, within one organisation', async () => {
    const db = await openDb({ seed: true });
    expect((await findVenues(db, HARBOURLIGHT, 'PIER')).map((v) => v.name)).toEqual(['Pier Kiosk']);
    expect((await findVenues(db, HARBOURLIGHT, '')).map((v) => v.name)).toEqual(['Harbour Street', 'Old Mill', 'Pier Kiosk']);
    expect(await findVenues(db, KESTREL, 'pier')).toEqual([]);
  });

  it('findVenues uses parameters, so a crafted search can\'t touch the tables', async () => {
    const db = await openDb({ seed: true });
    expect(await findVenues(db, HARBOURLIGHT, `'; drop table venues; --`)).toEqual([]);
    expect(await findVenues(db, HARBOURLIGHT, `%' or org_id <> '${HARBOURLIGHT}`)).toEqual([]);
    expect(await names(db, 'select count(*)::int from venues')).toEqual([4]);
  });
});
