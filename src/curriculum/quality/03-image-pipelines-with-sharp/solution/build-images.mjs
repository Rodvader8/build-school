// Turns photos/source.jpg into responsive images in dist/img/, plus a social image and an HTML snippet.
// Run it with:  node build-images.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SOURCE = 'photos/source.jpg';
const WIDTHS = [480, 960, 1600, 2400];
const OUT = 'dist/img';
mkdirSync(OUT, { recursive: true });

const { width: sourceWidth, height: sourceHeight } = await sharp(SOURCE).metadata();

// 1. Responsive files: never bigger than the original, three formats each. sharp drops metadata unless asked to keep it.
const widths = WIDTHS.filter((w) => w <= sourceWidth);
for (const width of widths) {
  const resized = () => sharp(SOURCE).resize({ width });
  await resized().avif({ quality: 50 }).toFile(`${OUT}/hero-${width}.avif`);
  await resized().webp({ quality: 75 }).toFile(`${OUT}/hero-${width}.webp`);
  await resized().jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/hero-${width}.jpg`);
}

// 2. The social image (og:image) stays a JPG: link previews can't always read WebP or AVIF.
await sharp(SOURCE).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(`${OUT}/hero-og.jpg`);

// 3. The <picture> snippet: AVIF first, then WebP, with the JPG as the fallback.
const largest = widths.at(-1);
const height = Math.round((sourceHeight * largest) / sourceWidth);
const sizes = '(min-width: 50rem) 50rem, 100vw';
const srcset = (ext) => widths.map((w) => `/img/hero-${w}.${ext} ${w}w`).join(', ');
const snippet = `<picture>
  <source type="image/avif" srcset="${srcset('avif')}" sizes="${sizes}" />
  <source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}" />
  <img src="/img/hero-960.jpg" srcset="${srcset('jpg')}" sizes="${sizes}" width="${largest}" height="${height}" alt="A native garden with a curved stone path" />
</picture>
`;
writeFileSync('dist/snippet.html', snippet);
console.log(`Made ${widths.length * 3 + 1} images from a ${sourceWidth}x${sourceHeight} original`);
