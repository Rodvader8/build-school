The first you hear of a production bug shouldn't be an angry email. And it shouldn't be a customer's password pasted into a bug report, either. Error monitoring is the habit of catching failures where they happen, in the browser and on the server, and sending them somewhere you'll see them, minus anything you shouldn't be holding.

Services like Sentry do the heavy lifting. They all work the same underneath, and the standard for your own setup is the same one they hold themselves to: **report every real error once, send a sample of the noisy ones, and never let personal data or a secret leave the building.**

## The four decisions

- **Catch.** In a browser, two events cover almost everything: `error` for code that throws, and `unhandledrejection` for a promise nobody caught. On a server, wrap each request so a crash is reported and the visitor gets a plain 500. Wrap the process too, for crashes nobody saw coming.
- **Dedupe.** One bug in a loop can fire ten thousand times a minute. Give each error a *fingerprint* (its name, its message with the numbers flattened, and where it happened) and send each fingerprint once per window.
- **Sample.** For very noisy, low-value errors you don't need every copy. A sample rate of 0.1 keeps one in ten.
- **Scrub.** An error message is written by developers and filled in by users, so it contains emails, phone numbers, tokens in URLs and the odd API key. Clean the message, the stack, the URL and everything in the context before the event leaves. Mask the values of keys called `password`, `token`, `authorization` and `cookie`, whatever they contain.

Never tell the visitor what went wrong in detail, either. "Something went wrong" and a reference number is plenty. A stack trace in a response is a map for an attacker.

## What you've got

`collector.mjs` is a small local server that stands in for the monitoring service: it accepts `POST /ingest` and keeps what it receives. `src/fingerprint.js` is written for you. `demo/` is a page that installs your browser reporter and can throw on demand. You write three files:

- `src/scrub.js`: `scrubString`, `scrubUrl` and `scrub`.
- `src/reporter.js`: `createReporter` (dedupe, sampling and building the event) and `installBrowserReporter`.
- `src/server.js`: `wrapHandler` and `installProcessHandlers`.

## Your turn

1. Run `npm install`, then read the comments in each file. They spell out exactly what each function takes and returns.
2. Do `scrub.js` first. Everything else depends on it, and it's the easiest to test by hand.
3. Then `createReporter`. Send nothing yet if it's a duplicate, then think about the order: dedupe, then sample, then scrub.
4. Add the browser and server pieces.
5. Press **Check my work**. The last two checks are the real thing: a Chromium page throws errors and a rejected promise four times each, and a server handler crashes with a fake key in its message. Both have to arrive at the collector once, and clean.

> Tip: the keys in the checks are fake and built from pieces, so no real credential is anywhere near this lesson. Keep it that way in your own tests.
