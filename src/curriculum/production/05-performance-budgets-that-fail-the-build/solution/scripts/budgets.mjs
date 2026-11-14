// A performance budget is a limit you commit to. This script measures the build and exits 1 if any limit is broken,
// so a heavy change can't reach production by accident.
// Usage: node scripts/budgets.mjs [dist] [budgets.json]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)]));
const gz = (file) => gzipSync(readFileSync(file)).length;

/** Sizes in bytes. JavaScript and CSS are gzipped (that's what travels); images are counted as they are. */
export function measure(dist) {
  const files = walk(dist);
  const html = readFileSync(path.join(dist, 'index.html'), 'utf8');
  // The scripts the page loads straight away: <script src> and <link rel="modulepreload" href>.
  const referenced = new Set([...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g), ...html.matchAll(/<link[^>]*rel="modulepreload"[^>]*\shref="([^"]+)"/g)].map((m) => path.join(dist, m[1])));
  const js = files.filter((f) => f.endsWith('.js'));
  const initialJs = js.filter((f) => referenced.has(f)).reduce((n, f) => n + gz(f), 0);
  const lazyJs = js.filter((f) => !referenced.has(f)).reduce((n, f) => n + gz(f), 0);
  const css = files.filter((f) => f.endsWith('.css')).reduce((n, f) => n + gz(f), 0) + (html.match(/<style[^>]*>[\s\S]*?<\/style>/g) ?? []).reduce((n, s) => n + gzipSync(s).length, 0);
  const images = files.filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f)).map((f) => ({ file: path.relative(dist, f), bytes: statSync(f).size }));
  const initialTotal = gzipSync(html).length + initialJs + images.reduce((n, i) => n + i.bytes, 0) + files.filter((f) => f.endsWith('.css')).reduce((n, f) => n + gz(f), 0);
  return { initialJs, lazyJs, css, images, initialTotal };
}

/** One violation per budget that's over: { budget, limit, actual } in KB. An empty list means the build is within budget. */
export function evaluate(measured, budgets) {
  const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;
  const rows = [
    ['initialJsKB', kb(measured.initialJs)],
    ['cssKB', kb(measured.css)],
    ['imageKB', kb(Math.max(0, ...measured.images.map((i) => i.bytes)))],
    ['initialTotalKB', kb(measured.initialTotal)],
  ];
  return rows.filter(([name, actual]) => actual > budgets[name]).map(([budget, actual]) => ({ budget, limit: budgets[budget], actual }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = process.argv[2] ?? 'dist';
  const budgets = JSON.parse(readFileSync(process.argv[3] ?? 'budgets.json', 'utf8'));
  if (!existsSync(path.join(dist, 'index.html'))) {
    console.error(`No ${dist}/index.html. Build first.`);
    process.exit(2);
  }
  const m = measure(dist);
  const kb = (b) => (b / 1024).toFixed(1);
  console.log(`initial JS ${kb(m.initialJs)} KB gzip | lazy JS ${kb(m.lazyJs)} KB | CSS ${kb(m.css)} KB | images ${m.images.map((i) => `${i.file} ${kb(i.bytes)} KB`).join(', ') || 'none'} | first load ${kb(m.initialTotal)} KB`);
  const violations = evaluate(m, budgets);
  for (const v of violations) console.error(`OVER BUDGET  ${v.budget}: ${v.actual} KB is over the limit of ${v.limit} KB`);
  console.log(violations.length === 0 ? 'budgets: within every limit' : `budgets: ${violations.length} over`);
  process.exit(violations.length === 0 ? 0 : 1);
}
