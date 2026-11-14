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

const source = styleCss;
const theme = /@theme\s*(?:static\s*)?\{([^}]*)\}/.exec(source)?.[1] ?? '';
const token = (name) => new RegExp(`--${name}\\s*:\\s*([^;]+);`).exec(theme)?.[1].trim();
const hexLuminance = (hex) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return NaN;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const names = ['ink', 'surface', 'line', 'cream', 'muted', 'accent'];

check('@theme defines the six colour tokens', names.every((n) => token(`color-${n}`)), 'Inside @theme, add --color-ink, --color-surface, --color-line, --color-cream, --color-muted and --color-accent.');
check('the palette is dark with readable text', hexLuminance(token('color-ink')) < 0.03 && hexLuminance(token('color-cream')) > 0.6, 'Write --color-ink as a very dark hex (like #0b0a14) and --color-cream as a light one (like #f4f1ea).');
check('@theme defines a sans and a display font family', /Geist/.test(token('font-sans') ?? '') && /Instrument Serif/.test(token('font-display') ?? ''), 'Add --font-sans: "Geist", ... and --font-display: "Instrument Serif", ... with a fallback after each.');
check('the theme variables are in the built CSS', names.every((n) => css.includes(`--color-${n}:`)) && /--font-display:[^;}]*Instrument Serif/.test(css) && /--font-sans:[^;}]*Geist/.test(css), 'Tailwind only emits tokens the page uses. Check the class names in index.html match your token names.');
check('the token utilities exist', ['bg-ink', 'text-cream', 'text-muted', 'border-line', 'bg-surface', 'bg-accent', 'font-display', 'font-sans'].every(hasRule), 'The classes bg-ink, text-cream, font-display and friends come from your @theme names.');
check('both fonts have an @font-face', /@font-face[^}]*Geist/.test(css) && /@font-face[^}]*Instrument Serif/.test(css), 'Add @font-face rules for "Geist" and "Instrument Serif" to src/style.css.');
const woff = dist.filter((f) => f.endsWith('.woff2'));
check('the fonts are self-hosted woff2 files', woff.length >= 2 && woff.every((f) => size(f) > 5000) && !/fonts\.(googleapis|gstatic)\.com/.test(css + builtHtml + page), 'Point src: url("./fonts/...woff2") at the files in src/fonts, and don\'t link to Google Fonts.');
check('the markup uses tokens, not one-off values', !/\[#|\[rgb|\[hsl|\[oklch/.test(page), 'Use bg-ink rather than bg-[#0b0a14]. Square-bracket colours skip the theme.');
check('there are no inline styles', !/\sstyle\s*=/.test(page) && !/\sstyle\s*=/.test(builtHtml), 'Remove any style="..." attributes. Use classes instead.');
