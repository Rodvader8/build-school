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

const { saltmarsh } = await import('./src/data/saltmarsh-bakehouse.ts');
const { tidepool } = await import('./src/data/tidepool-florist.ts');
const sites = [saltmarsh, tidepool].map((b) => ({ b, html: read(`dist/${b.slug}/index.html`) }));
const digits = (s) => s.replace(/\D/g, '');

check('both businesses get a page', sites.every((s) => s.html), 'Each business should build to /<slug>. Make one src/pages/[slug].astro with getStaticPaths.');
check('the pages come from one [slug].astro template', existsSync('src/pages/[slug].astro') && /getStaticPaths/.test(src('src/pages/[slug].astro')) && !existsSync('src/pages/saltmarsh-bakehouse.astro'), 'Create src/pages/[slug].astro with export function getStaticPaths(), and delete the hand-written page.');
check('each page has its business name as the h1', sites.every((s) => s.html && new RegExp(`<h1[^>]*>\\s*${s.b.name}\\s*</h1>`).test(s.html)), 'Render {business.name} inside the <h1>.');
check('each page shows its tagline and a description meta tag', sites.every((s) => s.html.includes(s.b.tagline) && meta(s.html, 'description') === s.b.description), 'Use business.tagline in the page and business.description in the meta description.');
check('every service is listed', sites.every((s) => s.html && s.b.services.every((x) => s.html.includes(x.name) && s.html.includes(x.blurb))), 'Use business.services.map(...) to make one <li> per service.');
check('every opening-hours row is listed', sites.every((s) => s.html && s.b.hours.every((x) => s.html.includes(x.days) && s.html.includes(x.open))), 'Use business.hours.map(...) to make one <li> per row.');
check('the phone number is a tel: link', sites.every((s) => s.html && new RegExp(`href="tel:\\+?${digits(s.b.phone)}"`).test(s.html) && s.html.includes(s.b.phone)), 'Build the link from business.phone: "tel:" + the number with spaces removed.');
check('each page only shows its own business', !sites[1].html.includes('Saltmarsh') && !sites[0].html.includes('Tidepool'), 'Nothing about one business should leak into the other. Read everything from the business you were handed.');
check('no phone numbers or names typed into the page template', !/5550|Saltmarsh|Tidepool/.test(src('src/pages/[slug].astro')), 'The template should read from data only, so it works for any business.');
