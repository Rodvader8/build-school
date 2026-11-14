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
const config = src('astro.config.mjs');
const pkg = JSON.parse(read('package.json') || '{}');
const islands = tags(home, 'astro-island');
const jsBytes = dist.filter((f) => f.endsWith('.js')).reduce((n, f) => n + size(f), 0);
const jsx = srcFiles.filter((f) => /\.(jsx|tsx)$/.test(f));

check('the config uses the Preact integration', /from\s+['"]@astrojs\/preact['"]/.test(config) && /integrations\s*:\s*\[[^\]]*preact\(\)/.test(config), 'In astro.config.mjs: import preact from "@astrojs/preact"; and add integrations: [preact()].');
check('the page has exactly one island', islands.length === 1, 'Add a client: directive to <Estimator>. Astro only makes a component interactive when you ask it to.');
check('the island hydrates when it is needed (visible or idle)', islands.some((t) => ['visible', 'idle'].includes(attr(t, 'client') ?? '')), 'Use client:visible, so the JavaScript only loads when the slider scrolls into view. client:load would load it straight away.');
check('the island is server-rendered first, with the right total', /\$54\.00/.test(home) && /<input[^>]*id="estimator-qty"/.test(home), 'With 6 loaves at $9.00 the total should read $54.00. In Estimator.jsx: const total = price * qty;');
check('the label is linked to the slider', /<label[^>]*for="estimator-qty"/.test(home) && /<input[^>]*id="estimator-qty"/.test(home), 'A label with for="..." matching the input id makes the control accessible.');
check('Preact is used, not React', !pkg.dependencies?.react && !pkg.dependencies?.['react-dom'] && jsx.every((f) => !/from\s+['"]react/.test(read(f))), 'Import hooks from "preact/hooks". Preact is about a tenth the size of React.');
check('the whole site ships under 40 KB of JavaScript', jsBytes > 0 && jsBytes < 40000, `Total JavaScript in dist is ${Math.round(jsBytes / 1000)} KB. A single small island should be well under 40 KB.`);
check('no inline styles, in .astro or .jsx files', srcFiles.every((f) => !/\sstyle\s*=/.test(read(f))), 'Use classes and put the CSS in site.css. That includes JSX style={{ ... }}.');
