// A tiny page that shows what your database holds, so you can see your SQL working in the preview.
// It starts a fresh in-memory Postgres on every refresh, so edit a .sql file, save, and refresh to see the change.
import http from 'node:http';
import { openDb } from './src/db.js';
import { revenueByVenue, monthlyRevenue, findVenues } from './src/queries.js';

const port = Number(process.argv[2] ?? 4855);
const ORG = 'a0000000-0000-4000-8000-000000000001';

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
    let body;
    try {
      const db = await openDb({ seed: true });
      body = [
        await section('Tables', async () => (await db.query(`select table_name from information_schema.tables where table_schema = 'public' order by 1`)).rows),
        await section('Revenue by venue (cents)', () => revenueByVenue(db, ORG)),
        await section('Revenue by month (cents)', () => monthlyRevenue(db, ORG)),
        await section('Venues matching "pier"', () => findVenues(db, ORG, 'pier')),
      ].join('');
    } catch (error) {
      body = `<h2>The database could not start</h2><pre class="err">${esc(error.message)}</pre>`;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><meta charset="utf-8"><title>Your database</title>
<style>body{font:16px system-ui;margin:2rem;background:#0b0a14;color:#f4f1ea}table{border-collapse:collapse;margin:.5rem 0}th,td{border:1px solid #2a2650;padding:.4rem .8rem;text-align:left}th{color:#a8a4c8}.err{color:#fb7185;white-space:pre-wrap}</style>
<h1>Your database</h1>${body}`);
  })
  .listen(port, '127.0.0.1', () => console.log(`Database page on http://localhost:${port}/`));
