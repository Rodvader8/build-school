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

const classes = used;
const distinct = new Set(classes);
check('the card is built from utility classes', distinct.size >= 12 && classes.filter((c) => hasRule(c)).length >= 12, 'Add at least 12 different Tailwind classes to the markup, such as p-6, rounded-2xl and bg-slate-900.');
check('it has padding and rounded corners', usedWithRule(/^p-\d/).length > 0 && usedWithRule(/^rounded/).length > 0, 'Try p-6 for padding and rounded-2xl for the corners.');
check('it has background, text and border colours', usedWithRule(/^bg-/).length > 0 && usedWithRule(/^text-(slate|cyan|emerald|white|zinc|gray|neutral|sky)/).length > 0 && usedWithRule(/^border-(slate|zinc|gray|neutral|white|cyan)/).length > 0, 'Use a bg-, a text- colour and a border- colour from the palette, such as bg-slate-900, text-slate-400 and border-slate-800.');
check('it lays out with flex or grid and a gap', usedWithRule(/^(flex|grid)$/).length > 0 && usedWithRule(/^gap-/).length > 0, 'Use flex flex-col gap-2 on the article.');
check('it sets a type size and weight', usedWithRule(/^text-(xs|sm|base|lg|xl|\dxl)$/).length > 0 && usedWithRule(/^font-(medium|semibold|bold)$/).length > 0, 'Use text-sm or text-4xl for size and font-semibold for weight.');
check('the link has a hover state', usedWithRule(/^hover:/).length > 0, 'Add a hover: class to the link, such as hover:bg-cyan-300.');
check('style.css has no rules of its own', /@import\s+["']tailwindcss["']/.test(styleCss) && !/[{}]/.test(styleCss), 'Keep src/style.css to the single @import line. The styling belongs in the markup.');
check('there are no inline styles', !/\sstyle\s*=/.test(page) && !/\sstyle\s*=/.test(builtHtml), 'Remove any style="..." attributes. Use classes instead.');
check('the markup keeps its meaning', /<article\b/.test(page) && /<a\s[^>]*href=/.test(page) && /<main\b/.test(page), 'Keep the <main>, <article> and <a href> elements. Classes style them, they do not replace them.');
