// A tiny static file server. Provided for you: the dev server and your scripts both use it.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
};

/**
 * Serves a folder on 127.0.0.1. Port 0 picks any free port. Returns { url, close }.
 * delays is optional: { '/hero.jpg': 400 } makes that file arrive 400ms late, like a slow connection.
 */
export async function serve(dir, port = 0, delays = {}) {
  const server = http.createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = path.join(dir, p.endsWith('/') ? p + 'index.html' : p);
    if (p.includes('..')) return res.writeHead(400).end();
    try {
      const body = await readFile(file);
      if (delays[p]) await new Promise((resolve) => setTimeout(resolve, delays[p]));
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}/`, close: () => new Promise((resolve) => server.close(resolve)) };
}
