Everything so far has been one piece at a time. Production is all of them at once, on the same project, and the standard is that a stranger could run it, break it at 2am and fix it from a page of notes.

This is your last project. You're taking a small orders dashboard (`orders-dashboard`) from "it runs on my laptop" to something you'd put your name on. The app itself works. What it doesn't have is everything around it, and that's what you've spent this track learning.

## The six things

1. **CI.** A workflow that installs with `npm ci`, then runs the secrets scan, lint, tests and build on every push and pull request. Pinned actions, read-only permissions, a timeout, cancelled stale runs.
2. **Budgets.** `budgets.json` with real limits, and a build that ends by running `scripts/budgets.mjs`, so a heavy change fails before it ships. (The budget script is written for you. It's the one from the last lesson.)
3. **Monitoring.** The browser reports its errors to `/api/errors`, and the server reports its own. Both are scrubbed before they leave, both are deduped, and the visitor never sees a stack trace.
4. **Security headers.** Every response carries them: pages, the API, 404s and crashes. The page has to work under its own policy, which means no inline scripts and no inline styles.
5. **A health endpoint.** `GET /healthz` says `ok` with a version and uptime, or `degraded` with a 503 and the name of whatever's missing. It's what an uptime monitor and a deploy script ask.
6. **A runbook.** `RUNBOOK.md`, short enough to read half asleep: how to deploy, how to roll back, where errors go, how to check health, what the budgets are, where secrets live.

## What's already there

The libraries from the earlier lessons are in `lib/`: headers, the scrubber, the reporter and `wrapHandler`. `server.js` exports `createApp()` and has four `TODO` markers: the headers, `/healthz`, the crash wrapper, and in `src/app.js` the browser reporter. `data/summary.json` is the dashboard's data, `.env.example` has placeholders only, and `tests/` has three tests that already pass.

## Your turn

1. Run `npm install`, then `npm run ci` to see the baseline. It passes, which is exactly the problem: it isn't checking enough yet.
2. Work through the four `TODO` markers. Start with the headers, then `/healthz`, then the wrapper, then the browser reporter.
3. Write `.github/workflows/ci.yml`, fill in `budgets.json` and add the budget step to the build script. Add `npm run scan` to the front of `ci`, and `.env` to `.gitignore`.
4. Write `RUNBOOK.md`. Use real commands: a runbook that says "run the deploy script" is a note to self.
5. Press **Check my work**. It builds, starts your server on a local port, loads the page in a real browser, crashes a route on purpose and throws an error in the page, and checks what arrives.

> Tip: write the runbook last, but write it from the checks. Every item in it should be something you've just proved works. That's the difference between documentation and hope.
