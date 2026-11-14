// Check my work: runs the tests in tests/ (open them, they're short and readable), builds the site with
// `next build`, then looks inside what the build made. Every check prints PASS or FAIL.
// The build goes to .next while `next dev` keeps its own files in .next/dev, so a running dev server isn't disturbed.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
const env = { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', CI: '1', NEXT_TELEMETRY_DISABLED: '1' };

if (!existsSync('node_modules/next') || !existsSync('node_modules/vitest')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

const clean = (s) =>
  String(s ?? '')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split(process.cwd()).join('.')
    .split('\n')
    .filter((l) => !/^\s*at /.test(l))
    .join('\n');
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const sourceFiles = [...walk('app'), ...walk('components'), ...walk('lib')].filter((f) => /\.(jsx?|css)$/.test(f));
/** The prerendered HTML for a route, e.g. html('/') or html('/menu/sourdough'). Empty if the build didn't make it. */
const html = (route) => read(`.next/server/app/${route === '/' ? 'index' : route.replace(/^\//, '')}.html`);

/* ---- 1. the tests: each test title prints as one PASS or FAIL line ---- */
if (existsSync('tests')) {
  const resultFile = path.join(os.tmpdir(), `bs-next-${process.pid}.json`);
  spawnSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${resultFile}`], { encoding: 'utf8', timeout: 300000, env });
  let report = null;
  try {
    report = JSON.parse(readFileSync(resultFile, 'utf8'));
  } catch {}
  rmSync(resultFile, { force: true });
  if (!report) {
    fail('the tests run', 'Vitest produced no report. Run "npx vitest run" in the terminal to see why.');
  } else {
    for (const file of report.testResults) {
      if (file.assertionResults.length === 0 && file.status === 'failed') fail(`${path.basename(file.name)} could not run`, clean(file.message));
      for (const t of file.assertionResults) {
        if (t.status === 'passed') pass(t.title);
        else fail(t.title, clean((t.failureMessages ?? [])[0]).split('\n').slice(0, 3).join('\n'));
      }
    }
  }
}

/* ---- 2. the site builds ---- */
const built = spawnSync('npx', ['next', 'build'], { encoding: 'utf8', timeout: 400000, env });
const buildLog = clean(built.stdout + built.stderr).split('\n').filter((l) => /error|Error|Cannot|not found|failed|Uncached|outside of/i.test(l));
const builds = built.status === 0;
check('the site builds', builds, buildLog.join('\n') || 'next build failed. Run "npm run build" in the terminal to read the full message.');

/* ---- 3. what the build made ---- */
const pages = ['/', '/about', '/menu', '/menu/rye', '/menu/focaccia'];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const titleOf = (r) => decode((html(r).match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? '');
const metaOf = (r, attr, name) => decode((html(r).match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) ?? [])[1] ?? '');
const titles = pages.map(titleOf);
check('every page has its own title, and inner pages end with | Fennel & Co', builds && titles.every(Boolean) && new Set(titles).size === pages.length && titles.slice(1).every((t) => t.endsWith('| Fennel & Co')), builds ? `Titles found: ${titles.join(' / ')}` : 'Fix the build first.');
check('every page has a meta description', builds && pages.every((r) => metaOf(r, 'name', 'description').length > 20), 'Each page needs a description. Set one in the layout as a default and a better one on each page.');
check('every page has a canonical link', builds && pages.every((r) => new RegExp(`<link rel="canonical" href="https://fennel-bakehouse\\.example${r === '/' ? '/?' : r}"`).test(html(r))), 'Set alternates: { canonical: \'./\' } and metadataBase in the layout.');
const og = metaOf('/menu/rye', 'property', 'og:image');
check('og:image is an absolute JPG or PNG that exists in public/', builds && /^https:\/\/.+\.(jpe?g|png)$/.test(og) && existsSync(`public/${og.split('/').pop()}`), `og:image was "${og}". Use a JPG or PNG (never WebP) and set metadataBase so the URL is absolute.`);
const sitemapFile = walk('.next/server/app').find((f) => /sitemap\.xml\.body$/.test(f));
check('the build creates sitemap.xml with every page', builds && !!sitemapFile && ['/menu/rye', '/menu/almond-tart', '/about'].every((p) => read(sitemapFile).includes(`https://fennel-bakehouse.example${p}`)), 'Add app/sitemap.js that returns one { url } per page.');
const robotsFile = walk('.next/server/app').find((f) => /robots\.txt\.body$/.test(f));
check('the build creates robots.txt pointing at the sitemap', builds && !!robotsFile && /Sitemap: https:\/\/fennel-bakehouse\.example\/sitemap\.xml/.test(read(robotsFile)), 'Add app/robots.js with rules and a sitemap URL.');
check('the home page has Bakery structured data', builds && /<script type="application\/ld\+json">[^<]*"@type":"Bakery"/.test(html('/')), 'Add a <script type="application/ld+json"> to the home page with @type "Bakery".');
