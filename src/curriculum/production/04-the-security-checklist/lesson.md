Most breaches aren't clever. A form that trusted what it was sent. A key committed by accident. A database table that anyone with the public key could read. None of it needs a genius to prevent, only a checklist and the habit of running it.

You'll build the six items that cover most real-world risk for a site or small app. Each one has a check that proves it works, not just that the file exists.

## The checklist

1. **Headers and CSP.** A Content-Security-Policy tells the browser exactly where a page may load things from, so an injected script has nowhere to run. Pair it with HSTS (always HTTPS), `nosniff`, a referrer policy and a permissions policy. These protect visitors even when your own code has a bug.
2. **Input validation.** Anything from outside is hostile until proven otherwise: check its type, its length and its shape, and build a *new* object with only the fields you asked for. If you copy the whole request into your database, someone will send `"role": "admin"`.
3. **Rate limiting.** Without a limit, a login form is a password guesser's best friend, and a signup form is a free spam relay. Count requests per client per window and answer 429 with a `Retry-After`.
4. **A secrets scanner.** Run it before every commit and in CI. It looks for strings shaped like live keys and fails the build. Rule one of a good report: say *where*, never *what*. A log that prints the key is a second leak.
5. **A dependency audit that fails the build.** `npm audit` reads your packages against a list of known holes. You'll write the part that matters: reading its JSON report, failing on high and critical findings, and allowing a named exception only with a reason and an expiry date. It works from a file here, so it never needs the network.
6. **Row Level Security.** If browser code talks to a database (Supabase, Postgres), the public key is in the page. The only thing between the world and your tables is RLS. Turn it on for every table, write a policy for each action, and compare the owner to `auth.uid()`. Switched on with no policy means nobody gets in. The service role key skips RLS entirely, so it lives only on a server, never in anything a browser loads.

## What you've got

`src/app.js` is a small API that uses your headers, your validator and your limiter. `fixtures/` has two sample audit reports. `db/schema.sql` has three tables. `.env.example` shows placeholder values, and nothing in this lesson is a real credential.

## Your turn

1. Fill in `src/headers.js`, `src/validate.js` and `src/ratelimit.js`. The comment above each function spells out the contract.
2. Write `scripts/scan-secrets.mjs` and `scripts/audit-offline.mjs`. Run them yourself: `node scripts/scan-secrets.mjs .` and `node scripts/audit-offline.mjs fixtures/npm-audit-high.json`.
3. Finish `db/policies.sql` for `notes` and `invoices`.
4. In `public/client.js`, swap the key that should never be there.
5. Add `.env` to `.gitignore`. Press **Check my work**.

> Tip: the checks plant fake keys in a throwaway folder and run your scanner on it, then run it on this whole project. If your scanner flags your own `.env.example`, your patterns are too greedy.
