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

const { brand } = await import('./src/data/brand.ts');
const html = read('dist/index.html');
const config = src('astro.config.mjs');
const page = src('src/pages/index.astro');
const layout = src('src/layouts/Base.astro');
const css = [...allHtml, ...allCss].map(read).join('\n');
const srcText = srcFiles.map(read).join('\n');
const section = (id) => new RegExp(`<section[^>]*\\sid="${id}"[^>]*>([\\s\\S]*?)</section>`).exec(html)?.[1] ?? '';
const allIn = (id, list, pick) => section(id) !== '' && list.every((item) => section(id).includes(pick(item)));
const imgs = tags(html, 'img');
const hero = imgs.find((t) => /hero/.test(attr(t, 'class') ?? '') || /hero/.test(attr(t, 'src') ?? ''));
const picture = /<picture[\s\S]*?<\/picture>/.exec(html)?.[0] ?? '';
const faces = (css.match(/@font-face\s*\{[^}]*\}/g) ?? []).filter((f) => /\.woff2/.test(f));
const preloads = tags(html, 'link').filter((t) => attr(t, 'rel') === 'preload' && attr(t, 'as') === 'font');
const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
let schema = null;
try { schema = ld.length === 1 ? JSON.parse(ld[0]) : null; } catch { schema = null; }
const llms = read('dist/llms.txt');
const jsBytes = dist.filter((f) => f.endsWith('.js')).reduce((n, f) => n + size(f), 0);
const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
const ogImage = meta(html, 'og:image') ?? '';

check('it is a one-page site', allHtml.length === 1 && existsSync('dist/index.html'), 'Everything lives on src/pages/index.astro. There should be one HTML file in dist.');
check('exactly one h1, and it is the headline from the data', tags(html, 'h1').length === 1 && new RegExp(`<h1[^>]*>\\s*${brand.headline}\\s*</h1>`).test(html), 'Render {brand.headline} inside a single <h1>.');
check('the page has the five sections', ['services', 'process', 'reviews', 'faqs', 'contact'].every((id) => section(id) !== ''), 'Use <section id="services">, "process", "reviews", "faqs" and "contact".');
check('every service comes from the data', allIn('services', brand.services, (s) => s.title) && allIn('services', brand.services, (s) => s.body), 'Map brand.services into <article class="card"> elements with an <h3> and a <p>.');
check('every process step comes from the data', allIn('process', brand.steps, (s) => s.title) && /<ol[^>]*class="steps"/.test(section('process')), 'Map brand.steps into an <ol class="steps"> of <li class="step"> items.');
check('every review comes from the data', allIn('reviews', brand.reviews, (r) => r.quote) && allIn('reviews', brand.reviews, (r) => r.who), 'Map brand.reviews into <figure class="quote"> with a <blockquote> and a <figcaption>.');
check('every FAQ is a details and summary', (section('faqs').match(/<details\b/g) ?? []).length === brand.faqs.length && allIn('faqs', brand.faqs, (f) => f.question) && allIn('faqs', brand.faqs, (f) => f.answer), 'Map brand.faqs into <details class="faq"><summary>question</summary><p>answer</p></details>.');
check('contact shows the phone, email and every hours row', section('contact').includes(brand.phone) && section('contact').includes(brand.email) && /href="tel:\+?\d+"/.test(section('contact')) && brand.hours.every((h) => section('contact').includes(h.opens) && section('contact').includes(h.closes)), 'Use tel: and mailto: links, and list the opening times from brand.hours.');
check('headings never skip a level', levels[0] === 1 && levels.every((l, i) => i === 0 || l <= levels[i - 1] + 1), 'Go h1, then h2 for each section, then h3 inside cards.');
check('no copy is typed into the page template', !(page + layout).includes(brand.headline) && !/5550|Harbourlight|Tidewater/.test(page + layout), 'The page and layout should read everything from src/data/brand.ts.');
check('the hero is an eager AVIF and WebP picture with width and height', /type="image\/avif"/.test(picture) && /type="image\/webp"/.test(picture) && !!hero && attr(hero, 'loading') === 'eager' && attr(hero, 'fetchpriority') === 'high' && Number(attr(hero, 'width')) > 0 && Number(attr(hero, 'height')) > 0, 'Use <Picture> from astro:assets with the imported hero, formats avif and webp, loading="eager" fetchpriority="high".');
check('every image has alt text, and lower images are lazy', imgs.length >= 2 && imgs.every((t) => (attr(t, 'alt') ?? '').length >= 10) && imgs.filter((t) => attr(t, 'loading') === 'lazy').length >= 1, 'Use brand.heroAlt and brand.roasteryAlt, and loading="lazy" for the roastery picture.');
check('fonts are declared locally, with the two variables the CSS expects', /fontProviders\.local\(\)/.test(config) && /--font-display/.test(config) && /--font-body/.test(config) && faces.length >= 2 && faces.every((f) => /url\(["']?\/[^)"':]*\.woff2/.test(f)), 'Declare both fonts with fontProviders.local(), cssVariable "--font-display" and "--font-body".');
check('the fonts are preloaded and nothing comes from Google', preloads.length >= 2 && !/fonts\.googleapis|fonts\.gstatic|cdn\.|jsdelivr|unpkg|cdnjs/i.test(css + srcText), 'Add <Font cssVariable="--font-display" preload /> and the same for --font-body to the layout head.');
check('GSAP is bundled from npm, with reduced motion respected', jsBytes > 20000 && dist.some((f) => f.endsWith('.js') && /gsap/i.test(read(f))) && srcFiles.some((f) => /\.(js|ts)$/.test(f) && /prefers-reduced-motion/.test(read(f)) && /matchMedia/.test(read(f))), 'Write src/scripts/home.js: import gsap, check prefers-reduced-motion, animate the .reveal elements, and import it from a <script> in index.astro.');
check('the head has a canonical link and Open Graph tags', tags(html, 'link').some((t) => attr(t, 'rel') === 'canonical' && /^https:\/\/harbourlight\.example\//.test(attr(t, 'href') ?? '')) && ['og:title', 'og:description', 'og:url', 'og:image'].every((k) => (meta(html, k) ?? '') !== '') && (meta(html, 'description') ?? '').length >= 70, 'Add the canonical link, og:title, og:description, og:url and og:image, plus a meta description of 70+ characters.');
check('og:image is an absolute JPG that exists in dist', /^https:\/\/harbourlight\.example\/.+\.jpe?g$/.test(ogImage) && existsSync('dist' + new URL(ogImage || 'https://x.invalid/').pathname), 'public/og.jpg is ready for you: https://harbourlight.example/og.jpg. Never WebP.');
check('JSON-LD describes a CafeOrCoffeeShop, suburb only', schema?.['@context'] === 'https://schema.org' && schema?.['@type'] === 'CafeOrCoffeeShop' && schema?.name === brand.name && schema?.telephone === brand.phone && schema?.address?.addressLocality === brand.suburb && !('streetAddress' in (schema?.address ?? {})) && (schema?.openingHoursSpecification ?? []).length === brand.hours.length, 'Build a schema object from brand in the layout and print it with <script type="application/ld+json" set:html={JSON.stringify(schema)} />.');
check('llms.txt and robots.txt are in the build', /^# Harbourlight Roasters\s*\n\s*\n> .{40,}/.test(llms) && /^- \[[^\]]+\]\(https:\/\/harbourlight\.example\//m.test(llms) && /^User-agent:\s*\*/mi.test(read('dist/robots.txt')), 'Create public/llms.txt (# name, > summary, a list of links) and public/robots.txt.');
check('no inline style attributes', srcFiles.every((f) => !/\sstyle\s*=/.test(read(f))), 'Classes only. The ready-made styles are in src/styles/site.css.');
