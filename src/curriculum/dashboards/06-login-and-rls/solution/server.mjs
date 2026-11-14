// A tiny "login" page: pick who you are, and see only what the database lets that person see.
// Nothing here filters by organisation. Every query below runs as the chosen user, so row-level security does the work.
import http from 'node:http';
import { openDb } from './src/db.js';
import { asUser, asAnon } from './src/session.js';

const port = Number(process.argv[2] ?? 4856);
const PEOPLE = {
  alice: { id: '11111111-1111-4111-8111-111111111111', label: 'Alice (Harbourlight)' },
  bob: { id: '22222222-2222-4222-8222-222222222222', label: 'Bob (Kestrel)' },
  carol: { id: '33333333-3333-4333-8333-333333333333', label: 'Carol (both)' },
};
const OTHER_ORG = 'b0000000-0000-4000-8000-000000000002';

const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const table = (rows) =>
  rows.length === 0
    ? '<p>No rows.</p>'
    : `<table><tr>${Object.keys(rows[0]).map((k) => `<th>${esc(k)}</th>`).join('')}</tr>${rows
        .map((r) => `<tr>${Object.values(r).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`)
        .join('')}</table>`;
const section = async (title, run) => {
  try {
    return `<h2>${esc(title)}</h2>${table(await run())}`;
  } catch (error) {
    return `<h2>${esc(title)}</h2><pre class="err">${esc(error.message)}</pre>`;
  }
};

http
  .createServer(async (req, res) => {
    const who = new URL(req.url, 'http://localhost').searchParams.get('as') ?? 'alice';
    const run = who === 'nobody' ? (fn) => asAnon(db0, fn) : (fn) => asUser(db0, PEOPLE[who]?.id ?? PEOPLE.alice.id, fn);
    let db0;
    let body;
    try {
      db0 = await openDb({ seed: true });
      body = [
        await section('Venues you can see', () => run(async (tx) => (await tx.query('select name, suburb from venues order by name')).rows)),
        await section('Sales rows you can see', () => run(async (tx) => (await tx.query('select v.name as venue, count(*)::int as days, sum(s.revenue_cents)::int as revenue_cents from daily_sales s join venues v on v.id = s.venue_id group by v.name order by 1')).rows)),
        await section("A crafted query: everything in Kestrel's sales, plus 'or true'", () => run(async (tx) => (await tx.query(`select count(*)::int as rows_returned from daily_sales where org_id = '${OTHER_ORG}' or true`)).rows)),
      ].join('');
    } catch (error) {
      body = `<h2>The database could not start</h2><pre class="err">${esc(error.message)}</pre>`;
    }
    const links = [...Object.entries(PEOPLE).map(([key, p]) => `<a href="/?as=${key}"${key === who ? ' class="on"' : ''}>${esc(p.label)}</a>`), `<a href="/?as=nobody"${who === 'nobody' ? ' class="on"' : ''}>Not logged in</a>`].join(' ');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><meta charset="utf-8"><title>Login and row-level security</title>
<style>body{font:16px system-ui;margin:2rem;background:#0b0a14;color:#f4f1ea}a{color:#22d3ee;margin-right:1rem}a.on{font-weight:700;text-decoration:none;color:#f4f1ea}table{border-collapse:collapse;margin:.5rem 0}th,td{border:1px solid #2a2650;padding:.4rem .8rem;text-align:left}th{color:#a8a4c8}.err{color:#fb7185;white-space:pre-wrap}</style>
<h1>Who's logged in?</h1><p>${links}</p>${body}`);
  })
  .listen(port, '127.0.0.1', () => console.log(`Login page on http://localhost:${port}/`));
