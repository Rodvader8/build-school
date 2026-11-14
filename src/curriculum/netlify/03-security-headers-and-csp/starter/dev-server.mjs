// A tiny static server for site/ that sends the headers from site/_headers, like Netlify does.
// Provided for you. After you edit _headers, refresh the preview (Ctrl+F5) to see the change.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { headersFor, parseHeadersFile } from './lib/headers.mjs';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const rel = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const file = path.join('site', path.normalize(rel));
  if (rel.includes('..') || rel === '_headers' || !existsSync(file)) {
    res.writeHead(404).end('Not found');
    return;
  }
  const rules = parseHeadersFile(existsSync('site/_headers') ? readFileSync('site/_headers', 'utf8') : '');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', ...headersFor(url.pathname, rules) });
  res.end(readFileSync(file));
}).listen(4821, '127.0.0.1', () => console.log('Preview on http://localhost:4821/'));
