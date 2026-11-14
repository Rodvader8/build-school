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
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const attr = (tag, name) => new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(tag)?.slice(2).find((v) => v !== undefined);
const textOf = (html) => decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

const { ironbark: d } = await import(`${path.resolve('src/data/ironbark.js')}?t=${Date.now()}`);
const files = { home: 'dist/index.html', services: 'dist/services/index.html', about: 'dist/about/index.html', contact: 'dist/contact/index.html' };
const html = Object.fromEntries(Object.entries(files).map(([k, f]) => [k, read(f)]));
const text = Object.fromEntries(Object.entries(html).map(([k, h]) => [k, textOf(h)]));

check('four pages are built: home, services, about and contact', Object.values(html).every(Boolean), 'Make src/pages/index.astro, services.astro, about.astro and contact.astro. Each should build to its own folder in dist.');
if (!Object.values(html).every(Boolean)) process.exit(0);

const head = (h, re) => decode(re.exec(h)?.[1] ?? '').trim();
const headFromData = Object.entries(d.pages).every(([k, p]) => head(html[k], /<title>([^<]*)<\/title>/) === p.title && head(html[k], /<meta name="description" content="([^"]*)"/) === p.description);
check('every page has its own title and description, from the data', headFromData, 'Each page reads its title and description from ironbark.pages in the data file.');

const navOk = Object.entries(html).every(([k, h]) => {
  const nav = /<nav\b[\s\S]*?<\/nav>/.exec(h)?.[0] ?? '';
  const here = d.nav.find((n) => (k === 'home' ? n.href === '/' : n.href === `/${k}/`));
  return (h.match(/<header\b/g) ?? []).length === 1 && (h.match(/<footer\b/g) ?? []).length === 1 && d.nav.every((n) => nav.includes(`href="${n.href}"`)) && new RegExp(`<a[^>]*href="${here.href}"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="${here.href}"`).test(nav) && (nav.match(/aria-current/g) ?? []).length === 1;
});
check('every page has one header and footer, and marks the current page', navOk, 'Put the header and footer in components used by one layout. The link to the page you are on gets aria-current="page", and no other link does.');

const need = {
  home: [d.pages.home.headline, d.pages.home.intro, ...d.pages.home.projects.flatMap((p) => [p.title, p.body]), d.pages.home.quote.text, ...d.pages.home.stats.map((s) => s.label)],
  services: [d.pages.services.headline, ...d.services.flatMap((s) => [s.title, s.summary, ...s.includes])],
  about: [d.pages.about.headline, ...d.pages.about.story, ...d.pages.about.team.flatMap((t) => [t.name, t.role, t.bio]), ...d.pages.about.values.flatMap((v) => [v.title, v.body])],
  contact: [d.pages.contact.headline, d.pages.contact.intro, d.hours, d.email, d.phone],
};
const missing = Object.entries(need).flatMap(([k, list]) => list.filter((t) => !text[k].includes(t)).map((t) => `${k}: "${t.slice(0, 50)}"`));
check('every page says what the data file says', missing.length === 0, `Not on the page yet:\n${missing.slice(0, 3).join('\n')}`);
const templates = walk('src').filter((f) => /\.astro$/.test(f)).map(read).join('\n');
const typed = Object.values(need).flat().filter((t) => t.length > 20 && templates.includes(t));
check('no copy is typed into the page templates', typed.length === 0, `This is typed into a .astro file: "${(typed[0] ?? '').slice(0, 60)}". Read it from the data.`);

const form = /<form\b[\s\S]*?<\/form>/.exec(html.contact)?.[0] ?? '';
const controls = form.match(/<(input|select|textarea)\b[^>]*>/g) ?? [];
const visible = controls.filter((c) => !['hidden', 'submit'].includes(attr(c, 'type')) && attr(c, 'tabindex') !== '-1');
const labelled = visible.every((c) => attr(c, 'id') && new RegExp(`<label[^>]*\\sfor="${attr(c, 'id')}"`).test(form));
const byName = (n) => controls.find((c) => attr(c, 'name') === n) ?? '';
const options = form.match(/<option\b/g)?.length ?? 0;
check(
  'the contact page has a labelled enquiry form',
  /method="post"/i.test(form) && /data-netlify/.test(form) && labelled && visible.length >= 5 && attr(byName('email'), 'type') === 'email' && attr(byName('phone'), 'type') === 'tel' && attr(byName('email'), 'autocomplete') === 'email' && attr(byName('name'), 'autocomplete') === 'name' && /\brequired\b/.test(byName('name')) && /\brequired\b/.test(byName('email')) && /<textarea[^>]*\brequired/.test(form) && options >= d.services.length + 1 && /<button[^>]*type="submit"/.test(form),
  'The form posts with data-netlify. Name, email, phone, service and message each have a <label for>, the right type and autocomplete, and name, email and message are required. The service list has an option for every service.',
);
check('the questions are details and summary', (html.contact.match(/<details\b/g) ?? []).length === d.pages.contact.faqs.length && d.pages.contact.faqs.every((f) => text.contact.includes(f.question) && text.contact.includes(f.answer)), 'Map the FAQs to <details><summary>question</summary><p>answer</p></details>.');

const imgsOk = Object.values(html).every((h) => {
  const imgs = h.match(/<img\b[^>]*>/g) ?? [];
  return imgs.every((t) => (attr(t, 'alt') ?? '').length >= 15) && imgs.filter((t) => attr(t, 'loading') !== 'lazy').length <= 1;
});
const imgCount = Object.values(html).reduce((n, h) => n + (h.match(/<img\b/g) ?? []).length, 0);
check('every image has useful alt text, and each page loads at most one eagerly', imgsOk && imgCount >= 5, 'Use the alt text in the data. The picture at the top of the page loads eagerly; the rest are lazy.');

const known = new Set(walk('dist').map((f) => '/' + path.relative('dist', f).split(path.sep).join('/')));
const broken = [];
for (const [k, h] of Object.entries(html)) {
  for (const m of h.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) {
    const p = m[1];
    if (!(known.has(p) || known.has(p.replace(/\/$/, '') + '/index.html') || known.has(p + 'index.html'))) broken.push(`${k}: ${p}`);
  }
}
check('every internal link goes somewhere that exists', broken.length === 0, `Broken links:\n${[...new Set(broken)].slice(0, 4).join('\n')}`);
