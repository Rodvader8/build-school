Most wrong code isn't badly reasoned. It's written from a confident memory of how a library *probably* works. `tries`, `retries`, `maxRetries`: every retry library names its options differently, and the one you picked from memory is a coin toss.

The cheap fix is to read the documentation first. It takes about five minutes, and it beats an hour of debugging code that ran without errors and did the wrong thing.

## How to read docs quickly

**Start at the index.** Most docs have an overview that points to pages. Read the overview, not the whole site.

**Read the options table, not the tutorial.** For a function you'll configure, the reference table has the name, the default and the unit. Those three facts cause most mistakes.

**Look at defaults first.** A default of "do nothing" is the most common trap. A retry library that retries zero times unless asked will happily "work" in every demo.

**Check units.** Seconds or milliseconds? Bytes or kilobytes? Pixels or rems? A wrong unit usually runs without complaint. It's wrong by a factor of a thousand.

**Check what counts as failure.** Does the function retry on a thrown error, a returned `false`, or an HTTP 500? The error page is where that lives.

**Find the test helpers.** A good library tells you how to test code that uses it. Here it's an environment variable that skips the waiting.

## Silent failure

Notice something about the starter code. It runs. No error, no warning. Yet it's wrong in several ways. That's the usual cost of a wrong guess: JavaScript ignores options it doesn't recognise, so a misspelt option is just *absent*. When a setting seems to do nothing, check the spelling in the docs before you suspect anything else.

```js
retry(fn, { tries: 4 });     // ignored: the option is called something else
retry(fn, { delay: 2000 });  // valid, but is it seconds or milliseconds?
```

## Your turn

The project is a report loader that calls a flaky endpoint through a small retry library, `nudge`, bundled in `vendor/nudge`. Its docs are in `vendor/nudge/docs/`.

1. Read `TASKS.md`: it lists what `loadReport` must do.
2. Run `node check.mjs`. The first draft in `fetch-report.js` fails. Don't fix it yet.
3. Read the nudge docs: the README first, then `options.md`, then `errors.md`.
4. Rewrite the options in `fetch-report.js` using only what the docs say.
5. In `DOCS_TRAIL.md`, write one line for each requirement: the docs page that settled it and the one fact it gave you. Keep each on a single line starting with its number.
6. Press **Check my work**.

> Tip: the point isn't to memorise nudge. It's to notice how much of the answer was a five-minute read away.
