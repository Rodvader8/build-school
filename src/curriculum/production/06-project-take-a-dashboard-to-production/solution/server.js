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
  const health = (res) => {
    const checks = { data: existsSync(dataFile) ? 'ok' : 'missing', site: existsSync(path.join(distDir, 'index.html')) ? 'ok' : 'missing' };
    const ok = Object.values(checks).every((v) => v === 'ok');
    res.setHeader('Cache-Control', 'no-store');
    sendJson(res, ok ? 200 : 503, { status: ok ? 'ok' : 'degraded', version: release, uptimeSeconds: Math.round((Date.now() - startedAt) / 1000), checks });
  };

  const handler = async (req, res) => {
    // Every response, including errors and 404s, carries the security headers.
    for (const [name, value] of Object.entries(securityHeaders())) res.setHeader(name, value);

    const { pathname } = new URL(req.url, 'http://localhost');
    if (pathname === '/healthz') return health(res);
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

  // A crash anywhere in the handler is reported, and the visitor gets a plain 500.
  return createServer(wrapHandler(handler, { reporter }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 4891);
  createApp().listen(port, '127.0.0.1', () => console.log(`Listening on http://127.0.0.1:${port}`));
}
