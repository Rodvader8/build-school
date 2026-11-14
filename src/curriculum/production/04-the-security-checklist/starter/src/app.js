// The small API your security code protects. Provided for you: it wires headers, the rate limit and validation together.
import { createServer } from 'node:http';
import { securityHeaders } from './headers.js';
import { validateSignup } from './validate.js';

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export function createApp({ limiter, maxBodyBytes = 10_000 }) {
  return createServer((req, res) => {
    for (const [name, value] of Object.entries(securityHeaders())) res.setHeader(name, value);
    res.removeHeader('X-Powered-By');

    const verdict = limiter.check(req.socket.remoteAddress ?? 'unknown');
    if (!verdict.allowed) {
      res.setHeader('Retry-After', String(verdict.retryAfterSeconds));
      return send(res, 429, { error: 'Too many requests' });
    }

    if (req.method === 'GET' && req.url === '/') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end('<!doctype html><title>Signup</title><h1>Signup</h1>');
    }
    if (req.method !== 'POST' || req.url !== '/signup') return send(res, 404, { error: 'Not found' });

    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBodyBytes) {
        send(res, 413, { error: 'Body too large' });
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on('end', () => {
      if (res.writableEnded) return;
      let input;
      try {
        input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return send(res, 400, { errors: { _: 'Invalid JSON' } });
      }
      const result = validateSignup(input);
      return result.ok ? send(res, 201, { ok: true }) : send(res, 400, { errors: result.errors });
    });
  });
}
