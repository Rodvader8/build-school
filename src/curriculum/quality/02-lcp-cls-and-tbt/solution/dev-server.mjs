// Serves site/ for the preview. The big images arrive 400ms late on purpose, like a slow connection.
import { serve } from './serve.mjs';

const { url } = await serve('site', 4832, { '/hero.jpg': 400, '/work.jpg': 250 });
console.log(`Preview on ${url}`);
