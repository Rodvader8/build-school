import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { securityHeaders } from './lib/headers.js';
import { createReporter } from './lib/reporter.js';
import { wrapHandler } from './lib/monitor.js';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const startedAt = Date.now();

const sendJson = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

/**
 * The whole app as a function, so the check (and your tests) can start it on any port with any data file.
 * distDir and dataFile can be changed, extraRoutes adds routes, and onClientError receives each browser error report.
 */
export function createApp({
  distDir = 'dist',
  dataFile = 'data/summary.json',
  release = process.env.RELEASE ?? pkg.version,
  // With ERROR_ENDPOINT set, errors go to the monitoring service. Without it they go to the log, scrubbed.
  reporter = createReporter({ endpoint: process.env.ERROR_ENDPOINT, release, send: process.env.ERROR_ENDPOINT ? undefined : (_url, event) => console.error(`error: ${event.message}`) }),
  extraRoutes = {},
  onClientError = () => {},
} = {}) {
  // TODO 2: write health(res). Answer 200 with { status: 'ok', version: release, uptimeSeconds, checks: { data, site } }
  //         when dataFile and distDir/index.html both exist, and 503 with status 'degraded' (and the failing check marked
  //         'missing') when one doesn't. Send Cache-Control: no-store. Use sendJson(res, status, body).

  const handler = async (req, res) => {
    // TODO 1: every response, including errors and 404s, needs the security headers (securityHeaders() from lib/headers.js).
    //         Set them first, before anything can return or throw.

    const { pathname } = new URL(req.url, 'http://localhost');
    // TODO 2: GET /healthz. Call health(res) here.
    if (extraRoutes[pathname]) return extraRoutes[pathname](req, res);

    if (pathname === '/api/summary') return sendJson(res, 200, JSON.parse(readFileSync(dataFile, 'utf8')));

    if (pathname === '/api/errors' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 20_000) return sendJson(res, 413, { error: 'Too large' });
      }
      try {
        onClientError(JSON.parse(body));
      } catch {
        return sendJson(res, 400, { error: 'Bad report' });
      }
      return sendJson(res, 202, { ok: true });
    }

    const file = path.join(distDir, pathname === '/' ? 'index.html' : pathname);
    if (!path.resolve(file).startsWith(path.resolve(distDir)) || !existsSync(file) || !statSync(file).isFile()) return sendJson(res, 404, { error: 'Not found' });
    res.setHeader('Content-Type', TYPES[path.extname(file)] ?? 'application/octet-stream');
    res.end(readFileSync(file));
  };

  // TODO 3: a crash anywhere in the handler should be reported and answered with a plain 500.
  //         wrapHandler (lib/monitor.js) does both. Wrap the handler with it, passing { reporter }.
  //         Right now a crash is swallowed: nobody hears about it and the visitor gets an empty page.
  return createServer((req, res) => handler(req, res).catch(() => res.writeHead(500).end()));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 4891);
  createApp().listen(port, '127.0.0.1', () => console.log(`Listening on http://127.0.0.1:${port}`));
}
