// A tiny static server for site/. Provided for you.
// It also plays the part of an analytics service: anything sent to /analytics/collect is written to
// analytics-hits.log, so you can see whether your script let a tracking request through.
import http from 'node:http';
import { appendFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

/**
 * Serves a folder on 127.0.0.1. Port 0 picks any free port. Returns { url, close }.
 * options.mut is used by the end-to-end lesson to break the page on purpose; leave it alone.
 */
export async function serve(dir, port = 0, options = {}) {
  const server = http.createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p === '/analytics/collect') {
      appendFileSync('analytics-hits.log', `${new Date().toISOString()} ${req.method} ${req.headers.referer ?? ''}\n`);
      return res.writeHead(204).end();
    }
    const file = path.join(dir, p.endsWith('/') ? p + 'index.html' : p);
    if (p.includes('..')) return res.writeHead(400).end();
    try {
      let body = await readFile(file);
      if (options.mut && p === '/app.js') body = Buffer.concat([Buffer.from(`window.__MUT = ${JSON.stringify(options.mut)};\n`), body]);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}/`, close: () => new Promise((resolve) => server.close(resolve)) };
}
