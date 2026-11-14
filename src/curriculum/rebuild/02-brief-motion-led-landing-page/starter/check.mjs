// Check my work: runs the quality gate (gate.mjs), then the rules that are particular to this brief.
// Every line prints PASS or FAIL. Open this file if you're curious.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { runGate } from './gate.mjs';

const built = await runGate();
if (!built) process.exit(0);

const out = console.log.bind(console);
const check = (name, ok, why = '') => {
  out(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 5)) out(`  ${line}`);
};
const read = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const walk = (d) => (existsSync(d) ? readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)])) : []);
const attr = (tag, name) => new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(tag)?.slice(2).find((v) => v !== undefined);

const { halden: d } = await import(`${path.resolve('src/data/halden.js')}?t=${Date.now()}`);
const html = read('dist/index.html');
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const text = decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
const templates = walk('src').filter((f) => /\.astro$/.test(f)).map(read).join('\n');

const fromData = [d.headline, d.intro, ...d.philosophy, ...d.speakers.flatMap((s) => [s.name, s.tagline, s.body, ...s.specs.flatMap((x) => [x.label, x.value])]), ...d.craft.flatMap((c) => [c.title, c.body]), d.quote.text];
const missing = fromData.filter((t) => !text.includes(t));
check('the page says what the data file says', missing.length === 0 && /<h1[^>]*>[\s\S]*?<\/h1>/.test(html) && decode(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)[1].replace(/<[^>]+>/g, '')).trim() === d.headline, `Not on the page yet: "${(missing[0] ?? d.headline).slice(0, 60)}". The h1 is the headline from the data, word for word.`);
const typed = fromData.filter((t) => templates.includes(t));
check('no copy is typed into the page template', typed.length === 0, `This sentence is typed into a .astro file: "${(typed[0] ?? '').slice(0, 60)}". Read it from src/data/halden.js instead.`);
const sectionIds = ['philosophy', 'speakers', 'craft', 'listening'];
check('the four sections are there', sectionIds.every((id) => new RegExp(`<section[^>]*\\sid="${id}"`).test(html)), 'Give the page <section> elements with the ids philosophy, speakers, craft and listening.');
const dls = html.match(/<dl\b[\s\S]*?<\/dl>/g) ?? [];
check('every speaker has its specs in a description list', dls.length >= d.speakers.length && d.speakers.every((s) => dls.some((dl) => s.specs.every((x) => decode(dl).includes(x.label) && decode(dl).includes(x.value)))), 'Each speaker needs a <dl> with a <dt> label and a <dd> value for every spec.');
const imgs = html.match(/<img\b[^>]*>/g) ?? [];
const eager = imgs.filter((t) => attr(t, 'loading') !== 'lazy');
check('every image has useful alt text, and only the hero loads eagerly', imgs.length >= 4 && imgs.every((t) => (attr(t, 'alt') ?? '').length >= 15) && eager.length === 1 && /hero/.test(attr(eager[0], 'class') ?? ''), 'Use the alt text in the data file. The hero image loads eagerly with fetchpriority="high"; the others use loading="lazy".');
const js = walk('dist').filter((f) => f.endsWith('.js')).map(read).join('\n');
const scripts = walk('src').filter((f) => /\.(js|astro)$/.test(f)).map(read).join('\n');
check('the motion is GSAP with ScrollTrigger, bundled from npm', /ScrollTrigger/.test(js) && /scrollTrigger|ScrollTrigger\.create/.test(scripts) && /from ['"]gsap\/ScrollTrigger['"]/.test(scripts) && /matchMedia/.test(scripts) && /prefers-reduced-motion/.test(scripts), 'Import gsap and gsap/ScrollTrigger from npm, and wrap the motion in gsap.matchMedia() for prefers-reduced-motion.');
const hype = text.match(/\b(revolutionary|stunning|world-class|cutting-edge|game-changing|unparalleled|best-in-class|state-of-the-art|passion for)\b/i);
check('the copy avoids hype words', !hype, `The tone is calm and exact. "${hype?.[0]}" has to go.`);
check('there is a way to book: an email link and a phone link', new RegExp(`href="mailto:${d.email}"`).test(html) && /href="tel:\+?\d+"/.test(html), 'Link the email with mailto: and the phone number with tel:.');
