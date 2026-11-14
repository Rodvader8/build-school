// Check my work: builds the site with "npm run build", then inspects what came out in dist/.
// Open this file if you're curious. Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));

if (!existsSync('node_modules/astro')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

const built = spawnSync('npm', ['run', 'build'], {
  encoding: 'utf8',
  timeout: 300000,
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', NO_COLOR: '1', FORCE_COLOR: '0' },
});
const buildLog = (built.stdout + built.stderr).split('\n').filter((l) => /error|Error|Could not|not found|failed/i.test(l));
check('the site builds', built.status === 0, buildLog.join('\n') || 'npm run build failed. Run it in the terminal to read the full message.');
if (built.status !== 0) process.exit(0);

/* ---- small helpers for reading the built site ---- */
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((f) => {
        const p = path.join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      })
    : [];
const dist = walk('dist');
const size = (file) => statSync(file).size;
/** Every opening tag with this name, as a string. */
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
const attr = (tag, name) => new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag)?.slice(2).find((v) => v !== undefined);
const meta = (html, key) => {
  const tag = tags(html, 'meta').find((m) => attr(m, 'name') === key || attr(m, 'property') === key);
  return tag ? attr(tag, 'content') : undefined;
};
const title = (html) => /<title>([^<]*)<\/title>/i.exec(html)?.[1].trim();
const text = (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const srcFiles = walk('src').filter((f) => /\.(astro|ts|js|jsx|css)$/.test(f));
const src = (file) => read(file);
const allHtml = dist.filter((f) => f.endsWith('.html'));
const allCss = dist.filter((f) => f.endsWith('.css'));

const home = read('dist/index.html');
const about = read('dist/about/index.html');
const pkg = JSON.parse(read('package.json') || '{}');
const jsFiles = dist.filter((f) => f.endsWith('.js'));
const pageScripts = (html) => tags(html, 'script');
const mine = srcFiles.filter((f) => /\.(js|ts)$/.test(f) || f.includes('pages/')).map((f) => [f, read(f)]);
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const reducedMotionUsed = mine.some(([, s]) => {
  const c = code(s);
  const m = /(?:const|let|var)\s+(\w+)\s*=\s*(?:window\.)?matchMedia\(\s*['"`][^'"`]*prefers-reduced-motion[^'"`]*['"`]\s*\)/.exec(c);
  return m ? (c.match(new RegExp(`\\b${m[1]}\\b`, 'g')) ?? []).length >= 2 : false;
});

check('gsap is a dependency in package.json', !!pkg.dependencies?.gsap && existsSync('node_modules/gsap'), 'In the terminal: npm install gsap');
check('no script is loaded from a CDN', ![home, about].some((h) => pageScripts(h).some((t) => /^https?:/.test(attr(t, 'src') ?? ''))) && !mine.some(([, s]) => /cdn\.|jsdelivr|unpkg|cdnjs/.test(s)), 'Delete the <script src="https://cdn..."> line. GSAP comes from npm instead.');
check('your animation code lives in src/scripts', existsSync('src/scripts') && walk('src/scripts').some((f) => /gsap/.test(read(f))), 'Create src/scripts/home.js with: import gsap from "gsap";');
check('the home page loads its script as a bundled module', pageScripts(home).some((t) => attr(t, 'type') === 'module' && /^\/_astro\/.+\.js$/.test(attr(t, 'src') ?? '')), 'In index.astro use <script> import "../scripts/home.js"; </script> (no is:inline). Astro bundles it.');
check('GSAP is bundled into the built script', jsFiles.some((f) => size(f) > 20000 && /gsap/i.test(read(f))), 'The page script should import gsap, so the bundler includes it in dist/_astro.');
check('the about page ships no scripts', pageScripts(about).length === 0, 'Only pages that need JavaScript should load any. Keep the script on the home page only.');
check('the animation checks prefers-reduced-motion', reducedMotionUsed, 'const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; then only animate if (!reduceMotion).');
check('the cards are visible without JavaScript', (home.match(/class="[^"]*\breveal\b/g) ?? []).length >= 3 && ![...allCss, 'dist/index.html'].some((f) => /\.reveal\s*\{[^}]*opacity\s*:\s*0\b/.test(read(f))), 'Never hide content in CSS and rely on a script to show it. Let gsap.from() set the starting opacity.');
check('no inline style attributes', srcFiles.every((f) => !/\sstyle\s*=/.test(read(f))), 'Use classes instead of style="...".');
