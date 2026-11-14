// Serves site/ on a port (default 4891). Provided for you: the Playwright config starts it.
// MUT is set by Check my work to break the page on purpose. Leave it alone.
import { serve } from './serve.mjs';

const port = Number(process.argv[2] ?? 4891);
const { url } = await serve('site', port, { mut: process.env.MUT });
console.log(`Serving on ${url}`);
