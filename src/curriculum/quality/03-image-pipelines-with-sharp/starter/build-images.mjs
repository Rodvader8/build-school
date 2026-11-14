// Turns photos/source.jpg into responsive images in dist/img/, plus a social image and an HTML snippet.
// Run it with:  node build-images.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SOURCE = 'photos/source.jpg';
const WIDTHS = [480, 960, 1600, 2400];
const OUT = 'dist/img';
mkdirSync(OUT, { recursive: true });

const { width: sourceWidth, height: sourceHeight } = await sharp(SOURCE).metadata();

// 1. Responsive files. Right now: JPG only, every width (even bigger than the original), and metadata kept.
for (const width of WIDTHS) {
  await sharp(SOURCE).resize({ width }).withMetadata().jpeg({ quality: 78 }).toFile(`${OUT}/hero-${width}.jpg`);
}

// 2. The social image (og:image). Right now it's a WebP, which many sites can't show.
await sharp(SOURCE).resize(1200, 630, { fit: 'cover' }).webp().toFile(`${OUT}/hero-og.webp`);

// 3. The <picture> snippet. TODO: write dist/snippet.html
console.log(`Source is ${sourceWidth}x${sourceHeight}`);
