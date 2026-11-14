// Runs Lighthouse on the built site and checks the STRUCTURAL audits you listed in lighthouse-assertions.json.
// Provided for you. It never gates on the performance score or on timings: those change with the machine.
// Usage: node scripts/assert-lighthouse.mjs [dist] [assertions.json]
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

const dist = path.resolve(process.argv[2] ?? 'dist');
const rules = JSON.parse(readFileSync(process.argv[3] ?? 'lighthouse-assertions.json', 'utf8'));
const mustPass = rules.mustPass ?? [];
const maxNumeric = rules.maxNumeric ?? {};
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = createServer((req, res) => {
  let file = path.join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
let failed = 0;
try {
  const ids = [...mustPass, ...Object.keys(maxNumeric)];
  const { lhr } = await lighthouse(`http://127.0.0.1:${server.address().port}/`, { port: chrome.port, output: 'json', logLevel: 'error', onlyAudits: ids });
  for (const id of mustPass) {
    const a = lhr.audits[id];
    const ok = !!a && (a.score === 1 || (a.score !== null && (a.details?.items ?? []).length === 0));
    console.log(`${ok ? 'PASS' : 'FAIL'} lighthouse ${id}${ok ? '' : `: ${a ? (a.details?.items ?? []).length + ' problem(s)' : 'no such audit'}`}`);
    if (!ok) failed++;
  }
  for (const [id, max] of Object.entries(maxNumeric)) {
    const value = lhr.audits[id]?.numericValue;
    const ok = typeof value === 'number' && value <= max;
    console.log(`${ok ? 'PASS' : 'FAIL'} lighthouse ${id} is ${Math.round(value)} (limit ${max})`);
    if (!ok) failed++;
  }
} finally {
  await chrome.kill();
  server.close();
}
process.exit(failed === 0 ? 0 : 1);
