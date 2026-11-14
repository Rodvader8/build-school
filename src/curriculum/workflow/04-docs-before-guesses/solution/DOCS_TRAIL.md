# Docs trail

For each requirement, name the docs page (for example `options.md`) that told you the right option, and the one thing it told you.

1. Total attempts: options.md says attempts counts every call including the first, so 4 total is attempts: 4, not 3 retries.
2. First wait and doubling: options.md says durations are in seconds, so delay: 2, and factor (not backoff) doubles it.
3. Exact timing: options.md says jitter defaults to 0.2, and 0 turns it off.
4. Retrying only some errors: errors.md says retryIf receives the error and returning false throws it straight away.
