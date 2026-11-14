# Make the report loader reliable

`fetch-report.js` wraps a flaky report endpoint with the `nudge` retry library (in `vendor/nudge`). Someone wrote a first version from memory. It runs without errors. It doesn't do what we need.

`loadReport(fetchReport)` must:

1. Call `fetchReport` up to **4 times in total** (one try and up to three retries).
2. Wait **2 seconds** before the second try, then **double** the wait each time (2, 4, 8).
3. Wait **exactly** that long. Support wants predictable timing, so no random variation.
4. Retry only an error that has `retryable: true`. Any other error must be thrown immediately, with no retries.

Don't guess option names or units. Read the docs in `vendor/nudge/docs/`, and in `DOCS_TRAIL.md` note which page settled each requirement.

You can try your code with `NUDGE_FAKE_TIME=1 node your-script.js`, so you don't have to wait for the real delays.
