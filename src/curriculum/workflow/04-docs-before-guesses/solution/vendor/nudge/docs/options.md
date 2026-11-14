# Options

**All durations are in seconds.** `delay: 2` waits two seconds. `delay: 2000` waits more than half an hour (capped by `maxDelay`).

Options nudge doesn't recognise are ignored without a warning, so check the spelling against this table.

| Option | Default | Meaning |
|---|---|---|
| `attempts` | `1` | The total number of times your function is called, **including the first**. `attempts: 4` means one try and up to three retries. The default of 1 means no retries at all. |
| `delay` | `1` | Seconds to wait before the second attempt. |
| `factor` | `2` | After each wait, the next wait is multiplied by this. |
| `maxDelay` | `30` | No single wait is ever longer than this many seconds. |
| `jitter` | `0.2` | Each wait is randomly scaled by up to plus or minus this fraction, so many clients don't retry in step. `0` turns it off and makes the waits exact. |
| `retryIf` | retry everything | A function that receives the error. Return `true` to retry, `false` to stop and throw that error straight away. |
