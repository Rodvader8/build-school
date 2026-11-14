import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../server.js';

async function withApp(fn) {
  const app = createApp({ distDir: 'src' });
  app.listen(0, '127.0.0.1');
  await once(app, 'listening');
  try {
    await fn(`http://127.0.0.1:${app.address().port}`);
  } finally {
    app.close();
  }
}

test('GET /api/summary returns four KPIs and the customer list', () =>
  withApp(async (base) => {
    const body = await (await fetch(`${base}/api/summary`)).json();
    assert.equal(body.kpis.length, 4);
    assert.ok(body.customers.length >= 3);
  }));

test('unknown paths answer 404 as JSON', () =>
  withApp(async (base) => {
    const res = await fetch(`${base}/nope`);
    assert.equal(res.status, 404);
    assert.equal((await res.json()).error, 'Not found');
  }));

test('the front page is served', () =>
  withApp(async (base) => {
    const res = await fetch(base);
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Orders dashboard/);
  }));
