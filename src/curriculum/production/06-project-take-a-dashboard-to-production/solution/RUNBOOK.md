# Runbook: Crumb and Co. orders dashboard

Read this when something is wrong at an awkward hour. It's short on purpose.

## Deploy

Merge to `main` once CI is green. CI runs `npm run ci`: the secrets scan, lint, the tests and a build that fails if it's over budget. The host builds `dist/` from `main` and publishes it. Never deploy from a laptop.

## Roll back

If a release is bad, go back first and investigate second. In the host's dashboard, publish the previous deploy: it moves the pointer, with no rebuild. If you're running the release folders yourself, point `current` back at the previous release. Then open a ticket for the bad one.

## Where errors go

Browser and server errors are reported with personal data and secrets already removed. Browser reports arrive at `/api/errors` and are forwarded with the server's own. Set `ERROR_ENDPOINT` to the monitoring service address. With none set, errors are written to the server log. Duplicates are sent once a minute, so a spike is one line, not ten thousand.

## Health check

`GET /healthz` returns 200 and `{ "status": "ok" }` with the version and uptime when the app and its data are in place. It returns 503 and `"degraded"` when something it needs is missing. Point the uptime monitor at it and alert on anything but 200.

## Budgets

`budgets.json` sets limits on initial JavaScript, CSS, the largest image and first-load weight. A change that breaks one fails the build. Fix it by loading less, not by raising the number. Raising a budget needs a note in the pull request.

## Secrets

Real values live in the host's environment settings and in a local `.env`, which is never committed. `.env.example` shows names with placeholders only. `npm run scan` fails on anything shaped like a live key. If a real key ever lands in git, rotate it first, then clean up.
