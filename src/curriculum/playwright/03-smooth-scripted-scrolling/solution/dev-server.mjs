// Serves site/ so you can look at the page in the preview. Provided for you.
import { serve } from './serve.mjs';

const { url } = await serve('site', 4853);
console.log(`Preview on ${url}`);
