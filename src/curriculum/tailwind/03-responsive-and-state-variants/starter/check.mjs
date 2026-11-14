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

check('the grid goes 1, 2 then 3 columns as the screen grows', used.includes('sm:grid-cols-2') && used.includes('lg:grid-cols-3') && inMedia('sm:grid-cols-2', /40rem/) && inMedia('lg:grid-cols-3', /64rem/), 'On the list, add sm:grid-cols-2 and lg:grid-cols-3 after grid-cols-1. Mobile first: the plain class is the phone layout.');
check('padding or type size steps up at md', used.some((c) => /^md:(p|px|py|text)-/.test(c) && inMedia(c, /48rem/)), 'Add something like md:px-8 and md:text-5xl so the page breathes on a tablet.');
check('the cards react to hover', used.some((c) => /^hover:/.test(c) && hasRule(c)), 'Add a hover: class to the cards, such as hover:border-accent.');
check('the links have a visible focus-visible style', used.some((c) => /^focus-visible:(outline|ring)/.test(c) && hasRule(c)), 'Add focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent to each link.');
check('movement is added with motion-safe', used.some((c) => /^motion-safe:/.test(c) && inMedia(c, /prefers-reduced-motion:\s*no-preference/)), 'Put the lift behind motion-safe: for example motion-safe:transition and motion-safe:hover:-translate-y-1.');
check('the pulsing dot stops with motion-reduce', used.includes('animate-pulse') && used.includes('motion-reduce:animate-none') && inMedia('motion-reduce:animate-none', /prefers-reduced-motion:\s*reduce/), 'Add motion-reduce:animate-none next to animate-pulse on the dot.');
check('there are no inline styles', !/\sstyle\s*=/.test(page) && !/\sstyle\s*=/.test(builtHtml), 'Remove any style="..." attributes. Use classes instead.');
