// Serves this folder so you can look at the before and after pages. Provided for you.
import { serve } from './serve.mjs';

const { url } = await serve('.', 4854);
console.log(`Preview on ${url}pages/before.html  (also after.html and almost.html in the same folder)`);
