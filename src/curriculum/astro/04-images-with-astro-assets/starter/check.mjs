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
const imgs = tags(home, 'img');
const hero = imgs.find((t) => /hero-img/.test(attr(t, 'class') ?? ''));
const photo = imgs.find((t) => /photo-img/.test(attr(t, 'class') ?? ''));
const picture = /<picture[\s\S]*?<\/picture>/.exec(home)?.[0] ?? '';
const original = 'src/assets/hero.jpg';
const emitted = dist.filter((f) => f.startsWith('dist/_astro/') && /\.(avif|webp|jpe?g|png)$/.test(f));
const ext = (e) => emitted.filter((f) => f.endsWith(e));
const og = meta(home, 'og:image');
const ogFile = og ? `dist${new URL(og).pathname}` : '';

check('the originals live in src/assets, not public', existsSync('src/assets/hero.jpg') && existsSync('src/assets/ovens.jpg') && !existsSync('public/hero.jpg') && !existsSync('public/ovens.jpg'), 'In the terminal: mkdir -p src/assets && mv public/*.jpg src/assets/');
check('the hero is a <picture> with AVIF and WebP sources', /<source[^>]*type="image\/avif"/.test(picture) && /<source[^>]*type="image\/webp"/.test(picture), 'Use <Picture src={hero} formats={["avif", "webp"]} ... /> from astro:assets.');
check('the hero offers at least three widths', ((attr(tags(picture, 'source').find((t) => attr(t, 'type') === 'image/avif') ?? '', 'srcset') ?? '').match(/\d+w/g) ?? []).length >= 3, 'Add widths={[480, 800, 1200]} so phones download a smaller file.');
check('the hero img has alt text, width and height', !!hero && (attr(hero, 'alt') ?? '').length >= 10 && Number(attr(hero, 'width')) > 0 && Number(attr(hero, 'height')) > 0, 'width and height stop the page jumping while the image loads. Astro adds them when src is an imported image.');
check('the hero loads eagerly with high priority', !!hero && attr(hero, 'loading') === 'eager' && attr(hero, 'fetchpriority') === 'high', 'The hero is above the fold: loading="eager" fetchpriority="high".');
check('the oven photo is a lazy WebP with width and height', !!photo && attr(photo, 'loading') === 'lazy' && /\.webp$/.test(attr(photo, 'src') ?? '') && Number(attr(photo, 'width')) > 0 && Number(attr(photo, 'height')) > 0, 'Use <Image src={ovens} width={800} format="webp" loading="lazy" alt="..." />.');
check('AVIF and WebP files were made at build time', ext('.avif').length >= 3 && ext('.webp').length >= 1, 'Look in dist/_astro. Astro writes one file per width and format.');
check('every generated image is smaller than the original JPG', existsSync(original) && [...ext('.avif'), ...ext('.webp')].every((f) => size(f) < size(original)), 'Each AVIF and WebP should be lighter than the file you started with.');
check('no plain <img> still points at a file in public', !imgs.some((t) => /^\/(hero|ovens)\.jpg/.test(attr(t, 'src') ?? '')), 'Replace the <img src="/hero.jpg"> tags with Picture and Image.');
check('every image has alt text', imgs.length > 0 && imgs.every((t) => (attr(t, 'alt') ?? '').length > 0), 'Every <img> needs an alt that describes it.');
check('og:image is an absolute JPG or PNG URL', !!og && /^https:\/\/saltmarsh\.example\/.+\.(jpe?g|png)$/.test(og), 'Make a share image with getImage({ src: hero, format: "jpg", width: 1200, height: 630 }) and pass share.src to the layout. Never WebP or AVIF.');
check('the og:image file really is a JPEG', !!ogFile && existsSync(ogFile) && readFileSync(ogFile).subarray(0, 2).toString('hex') === 'ffd8', 'The URL in og:image should point at a file that exists in dist.');
