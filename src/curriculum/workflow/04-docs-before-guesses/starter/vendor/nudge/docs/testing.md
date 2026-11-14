# Testing

Set the environment variable `NUDGE_FAKE_TIME=1` and nudge skips the actual waiting, so a test with a 30-second delay finishes instantly.

nudge exports `stats`, which describes the most recent `retry()` call:

```js
import { retry, stats } from './index.js';

stats.attempts; // how many times your function was called
stats.waits;    // the waits, in seconds, that nudge chose between attempts
```

`stats.waits` has one fewer entry than `stats.attempts`, because nothing waits before the first try.
