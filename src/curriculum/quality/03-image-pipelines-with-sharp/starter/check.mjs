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


if (!existsSync('node_modules/sharp')) {
  fail('dependencies are installed', 'Run "npm install" in the terminal first, then press Check my work again.');
  process.exit(0);
}
const sharp = (await import('sharp')).default;

rmSync('dist', { recursive: true, force: true });
const ran = spawnSync(process.execPath, ['build-images.mjs'], { encoding: 'utf8', timeout: 180000 });
check('build-images.mjs runs', ran.status === 0, (ran.stdout + ran.stderr).trim().split('\n').slice(-5).join('\n'));
if (ran.status !== 0) process.exit(0);

const source = await sharp('photos/source.jpg').metadata();
const OUT = 'dist/img';
const bytes = (f) => (existsSync(f) ? statSync(f).size : 0);
const magic = (f) => (existsSync(f) ? readFileSync(f).subarray(0, 16) : Buffer.alloc(16));
const isFormat = (f, ext) => {
  const b = magic(f);
  if (ext === 'jpg') return b[0] === 0xff && b[1] === 0xd8;
  if (ext === 'webp') return b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP';
  return b.subarray(4, 12).toString() === 'ftypavif';
};
const WIDTHS = [480, 960, 1600];
const EXTS = ['avif', 'webp', 'jpg'];

const problems = [];
for (const w of WIDTHS) {
  for (const ext of EXTS) {
    const f = `${OUT}/hero-${w}.${ext}`;
    if (!existsSync(f)) {
      problems.push(`missing ${f}`);
      continue;
    }
    if (!isFormat(f, ext)) problems.push(`${f} isn't really ${ext}`);
    else if ((await sharp(f).metadata()).width !== w) problems.push(`${f} isn't ${w}px wide`);
  }
}
check('three widths in three formats', problems.length === 0, problems.slice(0, 5).join('\n'));

const files = existsSync(OUT) ? readdirSync(OUT) : [];
const tooWide = [];
for (const f of files.filter((n) => /\.(jpg|webp|avif)$/.test(n))) {
  if (!/^hero-og\./.test(f) && (await sharp(path.join(OUT, f)).metadata()).width > source.width) tooWide.push(f);
}
check('nothing is upscaled', files.length > 0 && tooWide.length === 0, `Bigger than the ${source.width}px original: ${tooWide.join(', ')}`);

const notSmaller = WIDTHS.filter((w) => !(bytes(`${OUT}/hero-${w}.avif`) > 0 && bytes(`${OUT}/hero-${w}.avif`) < bytes(`${OUT}/hero-${w}.jpg`) && bytes(`${OUT}/hero-${w}.webp`) > 0 && bytes(`${OUT}/hero-${w}.webp`) < bytes(`${OUT}/hero-${w}.jpg`)));
check('modern formats are smaller', notSmaller.length === 0, `At ${notSmaller.join(', ')}px the AVIF or WebP isn't smaller than the JPG (or doesn't exist).`);

const withExif = [];
for (const f of files.filter((n) => /\.(jpg|webp|avif)$/.test(n))) {
  const meta = await sharp(path.join(OUT, f)).metadata();
  if (meta.exif) withExif.push(f);
}
check('metadata is stripped', files.length > 0 && withExif.length === 0, `Still carrying camera data: ${withExif.slice(0, 4).join(', ')}. Don't call .withMetadata().`);

const og = `${OUT}/hero-og.jpg`;
const ogMeta = existsSync(og) && isFormat(og, 'jpg') ? await sharp(og).metadata() : null;
check('the social image is a 1200x630 jpg', ogMeta?.width === 1200 && ogMeta?.height === 630 && !files.some((f) => /^hero-og\.(webp|avif)$/.test(f)), 'Make dist/img/hero-og.jpg at exactly 1200 by 630 (fit: "cover"), and no WebP version.');

const ogUrl = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i.exec(read('site/index.html'))?.[1] ?? '';
check('og:image is a jpg or png', /\.(jpe?g|png)$/i.test(ogUrl) && existsSync(`${OUT}/${path.basename(ogUrl)}`), `og:image is "${ogUrl}". Use a .jpg that your script makes, like hero-og.jpg.`);

/* ---- the <picture> snippet ---- */
const snippet = read('dist/snippet.html');
const sources = snippet.match(/<source\b[^>]*>/gi) ?? [];
const imgTag = (snippet.match(/<img\b[^>]*>/i) ?? [''])[0];
const attr = (t, name) => new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, 'i').exec(t)?.[1];
const candidates = (srcset) => (srcset ?? '').split(',').map((s) => s.trim().split(/\s+/)).filter((x) => x[0]);
const goodSet = (srcset, ext) => {
  const c = candidates(srcset);
  return c.length >= 3 && c.every(([url, d]) => /^\d+w$/.test(d ?? '') && url.endsWith('.' + ext) && existsSync(path.join('dist', url.replace(/^\//, ''))) && parseInt(d, 10) === sharpWidthSync(url));
};
function sharpWidthSync(url) {
  return parseInt(/-(\d+)\./.exec(url)?.[1] ?? '0', 10);
}
const types = sources.map((s) => attr(s, 'type'));
const picture =
  /<picture[\s>]/i.test(snippet) &&
  types[0] === 'image/avif' &&
  types[1] === 'image/webp' &&
  goodSet(attr(sources[0], 'srcset'), 'avif') &&
  goodSet(attr(sources[1], 'srcset'), 'webp') &&
  goodSet(attr(imgTag, 'srcset'), 'jpg') &&
  sources.every((s) => !!attr(s, 'sizes')) &&
  !!attr(imgTag, 'sizes') &&
  parseInt(attr(imgTag, 'width'), 10) > 0 &&
  parseInt(attr(imgTag, 'height'), 10) > 0 &&
  (attr(imgTag, 'alt') ?? '').length > 3;
check(
  'snippet.html is a proper picture element',
  picture,
  'dist/snippet.html needs <picture> with an AVIF <source> first, then WebP, then an <img> with JPG srcset. Every srcset entry is a real file with its width (480w), and sizes, width, height and alt are set.',
);
