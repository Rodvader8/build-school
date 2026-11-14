# nudge

Retry an async function with growing pauses between tries.

```js
import { retry } from './index.js';

const data = await retry(() => fetchSomething(), { attempts: 3, delay: 0.5 });
```

Pages in this folder:

- [options.md](options.md): every option, its unit and its default
- [errors.md](errors.md): what counts as a failure, and which failures are retried
- [testing.md](testing.md): running nudge in tests without waiting

Things people get wrong, in order of how often:

1. Expecting retries when you pass no options. See the default for `attempts`.
2. Passing milliseconds. See the unit note at the top of options.md.
3. Assuming a failed result is retried. See errors.md.
