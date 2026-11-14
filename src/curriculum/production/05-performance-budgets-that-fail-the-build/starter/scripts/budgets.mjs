// A performance budget is a limit you commit to. This script measures the build and exits 1 if any limit is broken,
// so a heavy change can't reach production by accident.
// Usage: node scripts/budgets.mjs [dist] [budgets.json]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)]));
const gz = (file) => gzipSync(readFileSync(file)).length;

/**
 * Measures a built site. Everything is in BYTES. JavaScript and CSS are gzipped (that's what travels); images are counted as they are.
 * Returns { initialJs, lazyJs, css, images, initialTotal }:
 *  - initialJs: the gzip size of the scripts the page loads straight away, found in dist/index.html as
 *    <script src="..."> and <link rel="modulepreload" href="...">
 *  - lazyJs: every OTHER .js file (code that only loads on demand)
 *  - css: gzip size of every .css file, plus every <style> block in index.html
 *  - images: [{ file, bytes }] for every image in dist (jpg, jpeg, png, webp, avif, gif, svg)
 *  - initialTotal: gzip of index.html + initialJs + the .css files + the images
 */
export function measure(dist) {
  // TODO
  return { initialJs: 0, lazyJs: 0, css: 0, images: [], initialTotal: 0 };
}

/**
 * Compares a measurement with budgets like { initialJsKB, cssKB, imageKB, initialTotalKB } (1 KB = 1024 bytes).
 * Returns one { budget, limit, actual } per budget that is OVER (actual in KB, one decimal place).
 * imageKB applies to the single largest image. A build within every budget returns [].
 */
export function evaluate(measured, budgets) {
  // TODO
  return [];
}

// The command line. Print a one-line summary of the sizes, print "OVER BUDGET  <budget>: ..." for each violation,
// and exit 1 if there are any, otherwise 0. Exit 2 if there is no dist/index.html.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // TODO
  console.log('budgets is not written yet');
  process.exit(2);
}
