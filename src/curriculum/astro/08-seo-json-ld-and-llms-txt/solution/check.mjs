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

const html = read('dist/index.html');
const { business } = await import('./src/data/saltmarsh.ts');
const layout = src('src/layouts/Base.astro');
const ld = tags(html, 'script').length ? [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]) : [];
let schema = null;
let parseError = '';
try {
  schema = ld.length === 1 ? JSON.parse(ld[0]) : null;
} catch (e) {
  parseError = e.message;
}
const llms = read('dist/llms.txt');
const robots = read('dist/robots.txt');
const descLen = (meta(html, 'description') ?? '').length;

check('the page has an absolute canonical link', tags(html, 'link').some((t) => attr(t, 'rel') === 'canonical' && attr(t, 'href') === 'https://saltmarsh.example/'), 'Add <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site).href} /> to the layout head.');
check('Open Graph title, description, url and type are set', ['og:title', 'og:description', 'og:url', 'og:type'].every((k) => (meta(html, k) ?? '').length > 0), 'Add the four og: meta tags. They use property="...", not name="...".');
check('og:image is an absolute JPG', /^https:\/\/saltmarsh\.example\/.+\.jpe?g$/.test(meta(html, 'og:image') ?? '') && existsSync('dist/og.jpg'), 'Point og:image at the JPG in public, as a full https:// address. Never WebP.');
check('the meta description is a useful length', descLen >= 70 && descLen <= 160, `The description is ${descLen} characters. Aim for 70 to 160.`);
check('there is exactly one h1', tags(html, 'h1').length === 1, 'One <h1> per page.');
check('there is one JSON-LD block and it parses', ld.length === 1 && schema !== null, parseError || 'Add <script type="application/ld+json" set:html={JSON.stringify(schema)} /> to the layout head.');
check('the JSON-LD says this is a Bakery on schema.org', schema?.['@context'] === 'https://schema.org' && schema?.['@type'] === 'Bakery', 'Use "@context": "https://schema.org" and "@type": "Bakery".');
check('name, telephone and url come from the data', schema?.name === business.name && schema?.telephone === business.phone && schema?.url === 'https://saltmarsh.example/', 'Build the object from the business data, not typed-out text.');
check('the address is the suburb only', schema?.address?.['@type'] === 'PostalAddress' && schema.address.addressLocality === business.suburb && schema.address.addressRegion === business.region && !('streetAddress' in schema.address), 'Use PostalAddress with addressLocality, addressRegion and addressCountry. Leave streetAddress out.');
check('opening hours match the data', Array.isArray(schema?.openingHoursSpecification) && schema.openingHoursSpecification.length === business.hours.length && business.hours.every((h, i) => JSON.stringify(schema.openingHoursSpecification[i]?.dayOfWeek) === JSON.stringify(h.days) && schema.openingHoursSpecification[i]?.opens === h.opens && schema.openingHoursSpecification[i]?.closes === h.closes), 'Map business.hours to OpeningHoursSpecification entries with dayOfWeek, opens and closes.');
check('no business details are typed into the layout', !/5550|Tidewater|Tuesday/.test(layout), 'The layout should read from src/data/saltmarsh.ts.');
check('llms.txt starts with the name and a summary', /^# Saltmarsh Bakehouse\s*\n\s*\n> .{40,}/.test(llms), 'Create public/llms.txt: a "# Name" line, a blank line, then a "> summary" line.');
check('llms.txt links to the site and lists the services', /^- \[[^\]]+\]\(https:\/\/saltmarsh\.example\/[^)]*\)/m.test(llms) && business.services.every((s) => llms.includes(s)), 'Add a "## Pages" list with "- [Home](https://...)" links, and list each service.');
check('robots.txt allows crawlers', /^User-agent:\s*\*/mi.test(robots) && !/^Disallow:\s*\/\s*$/m.test(robots), 'Create public/robots.txt with: User-agent: * and Allow: /');
