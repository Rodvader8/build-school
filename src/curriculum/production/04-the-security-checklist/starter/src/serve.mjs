// node src/serve.mjs: run the API by hand on port 4890.
import { createApp } from './app.js';
import { createLimiter } from './ratelimit.js';

createApp({ limiter: createLimiter({ limit: 30, windowMs: 60_000 }) }).listen(4890, '127.0.0.1', () => console.log('Listening on http://127.0.0.1:4890'));
