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

const theme = read('src/theme.js');
const head = /<head[\s\S]*?<\/head>/i.exec(page)?.[0] ?? '';
const inline = [...head.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)].map((m) => m[2]).join('\n');
const darkUsed = used.filter((c) => /^dark:/.test(c));

check('@custom-variant makes dark: follow the dark class', /@custom-variant\s+dark\s*\([^)]*\.dark/.test(styleCss), 'In src/style.css add: @custom-variant dark (&:where(.dark, .dark *));');
check('the built CSS keys dark: rules on the class, not the system setting', darkUsed.length > 0 && darkUsed.every((c) => css.includes(sel(c) + ':where(.dark')) && !mediaBlocks.some((b) => /prefers-color-scheme/.test(b.cond) && b.body.includes('dark\\:')), 'Without the @custom-variant line, dark: only follows the operating system setting.');
check('the page has light colours and dark: overrides for them', ['bg', 'text', 'border'].every((p) => darkUsed.some((c) => c.startsWith(`dark:${p}-`))) && used.some((c) => /^bg-(white|slate-50)$/.test(c)), 'Pair each light colour with a dark one: bg-white dark:bg-slate-950, text-slate-900 dark:text-slate-100, border-slate-200 dark:border-slate-800.');
check('the toggle is a real button with aria-pressed', /<button\b[^>]*id="theme-toggle"[^>]*aria-pressed=/.test(page), 'Keep <button id="theme-toggle" aria-pressed="false">. A button can be reached by keyboard, a div can\'t.');
check('an inline script in the head applies the saved theme before paint', /localStorage/.test(inline) && /classList\.add\(\s*['"]dark['"]/.test(inline) && /try\s*\{/.test(inline), 'Add a small <script> to <head> that reads localStorage in try/catch and adds the dark class. Running before paint stops a white flash.');
let behaviour = false;
try {
  const classes = new Set();
  const attrs = {};
  const store = {};
  let handler;
  const context = {
    document: {
      documentElement: { classList: { toggle: (c, on) => (on === undefined ? !classes.delete(c) && classes.add(c) : on ? classes.add(c) : classes.delete(c)), contains: (c) => classes.has(c), add: (c) => classes.add(c), remove: (c) => classes.delete(c) } },
      querySelector: () => ({ addEventListener: (type, fn) => type === 'click' && (handler = fn), setAttribute: (k, v) => (attrs[k] = v) }),
    },
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)) },
    matchMedia: () => ({ matches: false }),
  };
  (await import('node:vm')).runInNewContext(theme, context);
  handler?.();
  const first = classes.has('dark') && attrs['aria-pressed'] === 'true' && store.theme === 'dark';
  handler?.();
  behaviour = first && !classes.has('dark') && attrs['aria-pressed'] === 'false' && store.theme === 'light';
} catch {}
check('clicking the button toggles dark, aria-pressed and the saved choice', behaviour, 'In src/theme.js, on click: toggle the dark class on document.documentElement, set aria-pressed to "true" or "false", and save "dark" or "light" under the key "theme".');
check('saving the choice is wrapped in try/catch', /try\s*\{[^}]*localStorage\.setItem/.test(theme), 'Put localStorage.setItem inside try { } catch { }. Strict browser settings can make it throw.');
check('there are no inline styles', !/\sstyle\s*=/.test(page) && !/\sstyle\s*=/.test(builtHtml), 'Remove any style="..." attributes. Use classes instead.');
