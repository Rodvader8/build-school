// Serves the built images (dist/) and the page (site/) so you can look at them. Provided for you.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const TYPES = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif' };
createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  const name = p === '/' ? 'site/index.html' : p === '/snippet.html' ? 'dist/snippet.html' : `dist${p}`;
  if (p.includes('..') || !existsSync(name)) return res.writeHead(404).end('Not found. Run node build-images.mjs first?');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(name)] ?? 'text/plain' }).end(readFileSync(name));
}).listen(4833, '127.0.0.1', () => console.log('Preview on http://localhost:4833/  (and /snippet.html)'));
