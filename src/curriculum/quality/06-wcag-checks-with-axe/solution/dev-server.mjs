// Serves site/ for the preview. Provided for you.
import { serve } from './serve.mjs';

const { url } = await serve('site', 4836);
console.log(`Preview on ${url}`);
