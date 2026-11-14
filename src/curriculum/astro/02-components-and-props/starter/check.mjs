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
const component = src('src/components/ProductCard.astro');
const page = src('src/pages/index.astro');
const cards = home.match(/<article\b[^>]*class="[^"]*\bproduct-card\b[^"]*"[\s\S]*?<\/article>/g) ?? [];

check('a ProductCard component exists with typed props and a slot', /interface\s+Props/.test(component) && /Astro\.props/.test(component) && /<slot\s*\/?>/.test(component), 'Create src/components/ProductCard.astro with an interface Props, const { ... } = Astro.props and a <slot />.');
check('the page uses <ProductCard> three times', (page.match(/<ProductCard\b/g) ?? []).length === 3 && /import\s+ProductCard\s+from\s+['"][^'"]*ProductCard\.astro['"]/.test(page), 'Import ProductCard and use it once per product.');
check('the card markup is not copied into the page any more', !/<article\b/.test(page), 'The <article class="product-card"> belongs in the component only.');
check('the built page shows three product cards', cards.length === 3, 'dist/index.html should contain three <article class="product-card"> elements.');
check('each card shows its price to two decimals', ['$9.00', '$10.50', '$4.50'].every((p) => cards.some((c) => c.includes(p))), 'Use price.toFixed(2) so 9 shows as $9.00.');
check('each card keeps its name and its description', ['Country loaf', 'Seeded rye', 'Cinnamon scroll'].every((n) => cards.some((c) => c.includes(n))) && cards.every((c) => /<p>[^<]{15,}<\/p>/.test(c)), 'Pass the description as the content between <ProductCard> tags, and render it with <slot />.');
check('href is optional: some cards link, some do not', cards.some((c) => /<h3>\s*<a href=/.test(c)) && cards.some((c) => !/<h3>\s*<a /.test(c)), 'Give href?: string in Props, and render a link only when it exists. Pass href to one card.');
check('no inline style attributes', srcFiles.every((f) => !/\sstyle\s*=/.test(read(f))), 'Use classes in the stylesheet instead of style="...".');
