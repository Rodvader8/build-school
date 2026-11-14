// Check my work: runs your project and inspects what it does.
// Open this file if you're curious. Every check prints PASS or FAIL.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const out = console.log.bind(console);
const pass = (name) => out(`PASS ${name}`);
const fail = (name, why = '') => {
  out(`FAIL ${name}`);
  for (const line of String(why).trim().split('\n').filter(Boolean).slice(0, 6)) out(`  ${line}`);
};
const check = (name, ok, why) => (ok ? pass(name) : fail(name, why));
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
/** Source code without comments, so a comment can't fool a check. */
const codeOf = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');


if (!existsSync('node_modules/playwright')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const { chromium } = await import('playwright');
if (!existsSync(chromium.executablePath())) {
  fail('the browser is installed', 'Playwright needs its Chromium. Run "npx playwright install chromium" once (it needs the internet), then try again.');
  process.exit(0);
}
const HITS = 'analytics-hits.log';
/** How many tracking requests reached the pretend analytics service. */
const hits = () => read(HITS).split('\n').filter(Boolean).length;
/** Runs a script of the student's with node and returns what it printed. Only ever one at a time. */
const runNode = (args, env = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', timeout: 120000, env: { ...process.env, ...env } });
const tail = (r) => (r.stdout + r.stderr).trim().split('\n').slice(-5).join('\n');

rmSync('result.json', { force: true });
rmSync(HITS, { force: true });
const ran = runNode(['tour.mjs']);
let result = null;
try {
  result = JSON.parse(read('result.json'));
} catch {
  /* reported below */
}
check('tour.mjs runs', ran.status === 0 && !!result, tail(ran) || 'tour.mjs finished but didn\'t write result.json.');
const R = (name, ok, why) => check(name, !!result && ok, result ? why : 'tour.mjs didn\'t finish, so there\'s nothing to read yet.');

R('it reads the page title', result?.title === 'Blue Gum Landscaping', `title is ${JSON.stringify(result?.title)}. Use await page.title().`);
R(
  'it opens the menu and reads its links',
  result?.menuOpen === true && JSON.stringify(result?.menuLinks) === JSON.stringify(['Services', 'Contact']),
  `menuOpen: ${result?.menuOpen}, menuLinks: ${JSON.stringify(result?.menuLinks)}. Click the Menu button, then read page.locator('#menu a').allTextContents().`,
);
R('it reads the services', JSON.stringify(result?.services) === JSON.stringify(['Garden design', 'Planting and mulching', 'Regular maintenance']), `services: ${JSON.stringify(result?.services)}. Try page.locator('#services li').allTextContents().`);
R('it sees the error on an empty form', result?.errorShown === true, 'Click "Send enquiry" with nothing typed in, then check page.locator(\'#error\').isVisible().');
R('it fills the form and sees the thank-you', /^Thanks, we'll be in touch\.$/.test(result?.thanks ?? ''), `thanks: ${JSON.stringify(result?.thanks)}. Fill "Your name" and "Email", press Send enquiry, then read #thanks.`);

const src = codeOf(read('tour.mjs'));
check(
  'tracking requests are blocked',
  hits() === 0 && /\.route\(/.test(src) && /\.abort\(\)/.test(src) && ['googletagmanager', 'google-analytics', 'hotjar'].every((h) => src.includes(h)),
  hits() > 0 ? `${hits()} tracking request(s) reached the analytics service. Block them with page.route(...) before page.goto.` : 'Add page.route(...) with route.abort(), and list googletagmanager.com, google-analytics.com and hotjar.com.',
);
check('one browser, opened and closed', (src.match(/\.launch\(/g) ?? []).length === 1 && /browser\.close\(\)/.test(src), 'Launch exactly one browser and close it in a finally block.');
