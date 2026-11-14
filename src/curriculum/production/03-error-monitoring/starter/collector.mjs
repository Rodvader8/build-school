// A local stand-in for Sentry or any error service. Provided for you.
// It accepts POST /ingest, keeps what it receives in memory and answers 202. Nothing leaves this machine.
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

export function startCollector() {
  const events = [];
  const server = createServer((req, res) => {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
    if (req.method === 'OPTIONS') return res.writeHead(204, cors).end();
    if (req.method !== 'POST' || req.url !== '/ingest') return res.writeHead(404, cors).end();
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 50_000) req.destroy(); // an error report is never this big
    });
    req.on('end', () => {
      try {
        events.push(JSON.parse(body));
        res.writeHead(202, cors).end();
      } catch {
        res.writeHead(400, cors).end();
      }
    });
  });
  return new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () =>
      resolve({
        url: `http://127.0.0.1:${server.address().port}/ingest`,
        events,
        close: () => new Promise((done) => server.close(done)),
      }),
    ),
  );
}

// node collector.mjs: run it by hand and watch the events arrive.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const collector = await startCollector();
  console.log(`Collector listening: ${collector.url}`);
  setInterval(() => console.log(`${collector.events.length} event(s) so far`), 5000);
}
