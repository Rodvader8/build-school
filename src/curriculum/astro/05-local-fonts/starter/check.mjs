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

const config = src('astro.config.mjs');
const page = [...allHtml, ...allCss].map(read).join('\n');
const faces = page.match(/@font-face\s*\{[^}]*\}/g) ?? [];
const withFile = faces.filter((f) => /url\(["']?[^)"']*\.woff2/.test(f));
const woff2 = dist.filter((f) => f.endsWith('.woff2'));
const preloads = tags(read('dist/index.html'), 'link').filter((t) => attr(t, 'rel') === 'preload' && attr(t, 'as') === 'font');
const cssSrc = srcFiles.filter((f) => f.endsWith('.css') || f.endsWith('.astro')).map(read).join('\n');

check('the config declares fonts with fontProviders.local()', /fontProviders\.local\(\)/.test(config) && /\bfonts\s*:/.test(config), 'In astro.config.mjs add fonts: [{ provider: fontProviders.local(), name, cssVariable, options: { variants: [...] } }].');
check('both families have an @font-face in the built page', /Instrument Serif/.test(withFile.join('')) && /Figtree/.test(withFile.join('')), 'Declare "Instrument Serif" and "Figtree", then add a <Font cssVariable="..." /> for each to the layout head.');
check('every @font-face file is a local woff2', withFile.length >= 2 && withFile.every((f) => /url\(["']?\/[^)"':]*\.woff2/.test(f)), 'The src: url(...) should be a path on your own site, like /_astro/fonts/abc.woff2.');
check('the woff2 files are in dist and are real fonts', woff2.length >= 2 && woff2.every((f) => readFileSync(f).subarray(0, 4).toString() === 'wOF2'), 'Astro copies each font into dist/_astro/fonts at build time.');
check('nothing is fetched from Google or any other font host', !/fonts\.googleapis|fonts\.gstatic|use\.typekit|cdnjs|jsdelivr|unpkg/i.test(page + cssSrc), 'Delete the @import url(https://fonts.googleapis.com/...) line from site.css.');
check('the fonts are preloaded', preloads.length >= 2 && preloads.every((t) => /\.woff2$/.test(attr(t, 'href') ?? '') && /^\//.test(attr(t, 'href') ?? '') && t.includes('crossorigin')), 'Use <Font cssVariable="--font-figtree" preload /> so the browser starts fetching the font straight away.');
check('font-display is swap', withFile.length >= 2 && withFile.every((f) => /font-display\s*:\s*swap/.test(f)), 'Add display: "swap" to each font so text shows straight away in a fallback.');
check('the CSS uses the font variables', /var\(--font-figtree\)/.test(cssSrc) && /var\(--font-instrument-serif\)/.test(cssSrc), 'Use font-family: var(--font-figtree) for the body and var(--font-instrument-serif) for headings.');
check('the CSS no longer names the fonts directly', !/font(-family)?\s*:[^;{}]*['"]\s*(Figtree|Instrument Serif)\s*['"]/.test(cssSrc), 'Replace font-family: "Figtree" with the variable.');
check('each font has a fallback stack', /--font-figtree\s*:[^;}]*(sans-serif)/.test(page) && /--font-instrument-serif\s*:[^;}]*(serif)/.test(page), 'Add fallbacks: [...] to each font in the config.');
