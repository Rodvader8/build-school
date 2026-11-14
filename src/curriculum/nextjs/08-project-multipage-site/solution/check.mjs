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
const slugs = ['first-waves', 'turn-and-trim', 'reading-the-line-up', 'kids-camp'];
const pages = ['/', '/lessons', '/contact', ...slugs.map((s) => `/lessons/${s}`)];
const ORIGIN = 'https://ironbark-surf.example';
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const titleOf = (r) => decode((html(r).match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? '');
const metaOf = (r, attr, name) => decode((html(r).match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) ?? [])[1] ?? '');
const gone = pages.filter((r) => !html(r));
check('every page is prerendered: home, lessons, each lesson and contact', builds && gone.length === 0, builds ? `No HTML was built for: ${gone.join(', ')}` : 'Fix the build first.');
check('every page has one h1, the shared nav and a footer', builds && pages.every((r) => (html(r).match(/<h1[\s>]/g) ?? []).length === 1 && /<nav[^>]*>[\s\S]*href="\/contact"/.test(html(r)) && /<footer/.test(html(r))), 'Each page needs exactly one h1, and the layout provides the nav and footer.');
const titles = pages.map(titleOf);
check('every page has its own title, and inner pages end with | Ironbark Surf School', builds && titles.every(Boolean) && new Set(titles).size === pages.length && titles.slice(1).every((t) => t.endsWith('| Ironbark Surf School')), `Titles found: ${titles.join(' / ')}`);
check('every page has a description and a canonical link', builds && pages.every((r) => metaOf(r, 'name', 'description').length > 20 && new RegExp(`<link rel="canonical" href="${ORIGIN}${r === '/' ? '/?' : r}"`).test(html(r))), 'Set a description on each page, and alternates.canonical "./" with metadataBase in the layout.');
const og = metaOf('/lessons/kids-camp', 'property', 'og:image');
check('og:image is an absolute JPG or PNG that exists in public/', builds && /^https:\/\/.+\.(jpe?g|png)$/.test(og) && existsSync(`public/${og.split('/').pop()}`), `og:image was "${og}".`);
const sitemapFile = walk('.next/server/app').find((f) => /sitemap\.xml\.body$/.test(f));
const robotsFile = walk('.next/server/app').find((f) => /robots\.txt\.body$/.test(f));
check('sitemap.xml lists every page and robots.txt points at it', builds && !!sitemapFile && !!robotsFile && pages.every((r) => read(sitemapFile).includes(`${ORIGIN}${r === '/' ? '' : r}`)) && /Sitemap: https:\/\/ironbark-surf\.example\/sitemap\.xml/.test(read(robotsFile)), 'Add app/sitemap.js and app/robots.js.');
check('there is a custom not-found page', /Page not found/.test(html('/_not-found')), 'Create app/not-found.jsx with an h1 that says "Page not found".');
const imgs = pages.flatMap((r) => html(r).match(/<img\b[^>]*>/g) ?? []);
const hero = (html('/').match(/<img\b[^>]*>/g) ?? []).find((i) => /hero\.jpg/.test(decodeURIComponent(i))) ?? '';
check('the home hero is preloaded and every image comes from next/image with width and height', builds && !!hero && !/loading="lazy"/.test(hero) && /<link rel="preload" as="image"[^>]*hero/.test(decodeURIComponent(html('/'))) && imgs.length >= 5 && imgs.every((i) => /\balt="/.test(i) && /\bwidth="\d+"/.test(i) && /\bheight="\d+"/.test(i) && /\/_next\/image/.test(i)), 'Use <Image preload> on the hero and <Image> with width and height everywhere else.');
const layout = read('app/layout.jsx');
const css = walk('.next/static').filter((f) => f.endsWith('.css')).map(read).join('\n');
check('fonts are local files loaded by next/font/local, with nothing from Google', /next\/font\/local/.test(layout) && !/next\/font\/google/.test(layout) && (layout.match(/localFont\(/g) ?? []).length >= 2 && builds && (html('/').match(/\.woff2\\?",\\?"font/g) ?? []).length >= 2 && !/googleapis|gstatic/.test(html('/') + css), 'Load both fonts with localFont from app/fonts, and put both variable classes on <html>.');
check('the FAQ on the home page uses details and summary', builds && (html('/').match(/<details/g) ?? []).length >= 3 && (html('/').match(/<summary/g) ?? []).length >= 3, 'Render each FAQ as <details><summary>...</summary>...</details>.');
check('the build includes the /api/enquiry route', builds && /"\/api\/enquiry\/route"/.test(read('.next/app-path-routes-manifest.json')), 'Create app/api/enquiry/route.js with a POST handler.');
check('the code has no hard-coded addresses or keys', ['app/api/enquiry/route.js', 'lib/notify.js', 'lib/validate.js'].every((f) => !/https?:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(read(f).replace(/^\s*\/\/.*$/gm, ''))) && /process\.env\.ENQUIRY_WEBHOOK_URL/.test(read('lib/notify.js')) && /ENQUIRY_WEBHOOK_URL=/.test(read('.env.example')), 'Keep the webhook address in the environment, and the name in .env.example.');
const clientFiles = sourceFiles.filter((f) => /\.jsx?$/.test(f) && /^\s*(['"])use client\1/.test(read(f)));
check('only the enquiry form is a client component', clientFiles.length === 1 && /EnquiryForm/.test(clientFiles[0]), 'Pages and the layout stay server components.');
check('there are no inline style props', !sourceFiles.some((f) => /\.jsx?$/.test(f) && /style\s*=\s*\{/.test(read(f))), 'Remove style={{ ... }} and use classes.');
