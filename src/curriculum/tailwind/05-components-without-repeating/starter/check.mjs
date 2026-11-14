// Check my work: builds the site with "npm run build", then inspects the HTML and CSS that came out in dist/.
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

if (!existsSync('node_modules/tailwindcss') || !existsSync('node_modules/vite')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}

const built = spawnSync('npm', ['run', 'build'], { encoding: 'utf8', timeout: 300000, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } });
const buildLog = (built.stdout + built.stderr).split('\n').filter((l) => /error|Error|Could not|not found|failed|Cannot/i.test(l));
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
const size = (file) => statSync(file).size;
const dist = walk('dist');
const css = dist.filter((f) => f.endsWith('.css')).map(read).join('\n'); // everything Tailwind generated
const builtHtml = read('dist/index.html');
const page = read('index.html'); // the page as you wrote it
/** Every class name used in a piece of markup. */
const classesIn = (html) => [...html.matchAll(/\sclass\s*=\s*"([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean);
/** The selector Tailwind writes for a class, e.g. md:p-8 becomes .md\:p-8 */
const sel = (name) => '.' + name.replace(/[^\w-]/g, '\\$&');
/** True when the built CSS has a rule for this class. */
const hasRule = (name) => css.includes(sel(name));
const used = classesIn(page);
const usedWithRule = (re) => used.filter((c) => re.test(c) && hasRule(c));
/** The stylesheet with comments removed. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
const styleCss = stripComments(read('src/style.css'));
/** Every @media block in the built CSS (and any nested inside one), as { cond, body }. */
const mediaBlocks = (() => {
  const blocks = [];
  const scan = (text) => {
    for (let i = text.indexOf('@media'); i !== -1; i = text.indexOf('@media', i + 6)) {
      const open = text.indexOf('{', i);
      let depth = 1;
      let j = open + 1;
      while (j < text.length && depth > 0) depth += text[j] === '{' ? 1 : text[j] === '}' ? -1 : 0, j++;
      const body = text.slice(open + 1, j - 1);
      blocks.push({ cond: text.slice(i + 6, open).trim(), body });
    }
  };
  scan(css);
  return blocks;
})();
/** True when the class's rule sits inside an @media block whose condition matches. */
const inMedia = (name, cond) => mediaBlocks.some((b) => cond.test(b.cond) && b.body.includes(sel(name)));

const sources = ['index.html', 'src/components.js', 'src/main.js'].map(read).join('\n');
const { pathToFileURL } = await import('node:url');
let card;
try {
  card = (await import(pathToFileURL(path.resolve('src/components.js')).href)).card;
} catch {}
const sample = typeof card === 'function' ? String(card({ name: 'Family Trust', type: 'Trust', value: 2400000 })) : '';
const hostile = typeof card === 'function' ? String(card({ name: '<img src=x>', type: 'Trust', value: 1 })) : '';
let rendered = '';
try {
  globalThis.document = { querySelector: () => ({ set innerHTML(v) { rendered = v; } }) };
  await import(pathToFileURL(path.resolve('src/main.js')).href + '?check');
} catch {}

check('card() returns a card for one entity', /<article\b/.test(sample) && sample.includes('Family Trust') && sample.includes('$2,400,000'), 'In src/components.js, card(entity) should return an <article> containing the name, the type and the value formatted like $2,400,000.');
check('the card\'s class list is written once', (sources.match(/rounded-2xl/g) ?? []).length === 1, 'The long class list should appear in exactly one place: inside card(). Delete the pasted copies from index.html.');
check('main.js renders every entity through card()', (rendered.match(/<article\b/g) ?? []).length === 5 && rendered.includes('Education Trust'), 'In src/main.js, set the #cards element\'s innerHTML to entities.map(card).join(\'\').');
check('data is escaped before it goes into HTML', typeof card === 'function' && !hostile.includes('<img'), 'Run each value through a small escapeHtml() so a name like <img src=x> shows as text.');
check('index.html has no pasted cards left', !/<article\b/.test(read('index.html')), 'The cards are generated now. Remove the <article> blocks from index.html and keep the empty #cards section.');
check('.btn is built with @apply', /\.btn\s*\{[^}]*@apply\s+[^;}]+;/.test(styleCss) && /\.btn\s*\{[^}]*\}/.test(css.replace(/\s+/g, '')) , 'In src/style.css, write .btn { @apply inline-block rounded-full bg-accent px-5 py-2 ...; }');
check('@apply carries at least five utilities, including a state', (/\.btn\s*\{[^}]*@apply\s+([^;}]+);/.exec(styleCss)?.[1].trim().split(/\s+/).length ?? 0) >= 5 && /@apply[^;]*(hover|focus-visible):/.test(styleCss), 'List at least five utilities after @apply, including hover: and focus-visible: ones. Variants work inside @apply.');
check('Tailwind still finds the classes inside the JavaScript', ['rounded-2xl', 'bg-surface', 'border-line', 'text-accent'].every(hasRule), 'Tailwind scans .js files too, so classes written in full inside card() are generated. Don\'t build class names from pieces.');
check('there are no inline styles', !/\sstyle\s*=/.test(sources) && !/\sstyle\s*=/.test(builtHtml), 'Remove any style="..." attributes. Use classes instead.');
