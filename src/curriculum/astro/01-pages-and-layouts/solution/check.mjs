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

const pages = { home: 'dist/index.html', menu: 'dist/menu/index.html', about: 'dist/about/index.html' };
const html = Object.fromEntries(Object.entries(pages).map(([k, f]) => [k, read(f)]));
const layout = src('src/layouts/Base.astro');

check('a layout exists with a slot and props', /<slot\s*\/?>/.test(layout) && /Astro\.props/.test(layout), 'Create src/layouts/Base.astro with <slot /> and const { title, description } = Astro.props;');
check('index and menu use the layout instead of repeating the page shell', ['index', 'menu'].every((n) => /layouts\/Base\.astro/.test(src(`src/pages/${n}.astro`)) && !/<html\b/.test(src(`src/pages/${n}.astro`))), 'Each page should import Base and wrap its content in <Base>...</Base>, with no <html> of its own.');
check('there is an about page', existsSync(pages.about), 'Create src/pages/about.astro. It becomes /about.');
check('every page has its own title', Object.values(html).every((h) => title(h)) && new Set(Object.values(html).map(title)).size === 3 && Object.values(html).every((h) => /Saltmarsh Bakehouse/.test(title(h) ?? '')), 'Pass a different title to the layout from each page, and keep the business name in it.');
check('every page has a meta description', Object.values(html).every((h) => (meta(h, 'description') ?? '').length >= 50), 'Add <meta name="description" content={description} /> to the layout, and pass a description from each page.');
check('every page says lang="en-AU"', Object.values(html).every((h) => /<html[^>]*\blang="en-AU"/.test(h)), 'Set <html lang="en-AU"> once, in the layout.');
check('every page has the same navigation, including About', Object.values(html).every((h) => ['/', '/menu', '/about'].every((href) => new RegExp(`<a[^>]*href="${href}"`).test(h) && /class="site-nav"/.test(h))), 'Put the <nav class="site-nav"> in the layout, with links to /, /menu and /about.');
check('every page has exactly one h1', Object.values(html).every((h) => tags(h, 'h1').length === 1), 'Each page should have a single <h1>.');
