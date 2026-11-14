A normal Netlify Function (last lesson) runs when a request reaches a particular URL. An **edge function** runs *before* the page is served, on a server close to the visitor, for any paths you choose. That makes it the right tool for things that need to see every request: redirecting by country, adding headers, or, as in this lesson, noticing when an AI crawler such as GPTBot or ClaudeBot visits.

Edge functions run on Deno, not Node, so they stick to web standards: `Request`, `Response`, `fetch`, `URL`. If you can write those, you can write an edge function.

```js
export default async (request, context) => {
  // look at the request, then...
  return context.next(); // ...carry on to the normal page
};

export const config = { path: '/*', excludedPath: ['/*.css', '/*.js'] };
```

`context.next()` hands the request on and gives you the page's response, which you can change or return as it is. `excludedPath` stops the function from running for every stylesheet and script.

## Blobs: a tiny key-value store

Your site has no database, but sometimes you need to remember something small: a count, a setting, a log. **Netlify Blobs** is a key-value store built into the platform. You open a named store and read or write values by key:

```js
import { getStore } from '@netlify/blobs';

const store = getStore('crawler-log');
await store.setJSON('2026-11-14/GPTBot', { count: 1 });
const entry = await store.get('2026-11-14/GPTBot', { type: 'json' }); // the object, or null
```

That's the whole idea. A key like `date/crawler` gives you a tidy daily tally that's easy to read later.

## Design it so you can test it

You can't run Deno or Blobs inside this lesson, and you shouldn't need to. The trick is to split the function into plain pieces:

- `detectCrawler(userAgent)` is a pure function: text in, name out.
- `logHit(store, crawler, request, now)` takes the store as an argument, so a test can pass a fake one made from a `Map`.
- `makeHandler(openStore)` builds the real handler from a way of opening the store. The real wiring is one line at the bottom of the file.

Check my work imports your file and calls these as ordinary functions with ordinary `Request` objects. It's how you test anything that talks to a service: **pass in the thing that touches the outside world.**

## Three rules for a log like this

1. **Never break the page.** Logging is a bonus. If the store is down, the visitor still gets their page: catch the error, return `context.next()` anyway.
2. **Don't wait for it.** `context.waitUntil(promise)` lets the work finish after the response has gone, so logging adds no delay.
3. **Keep it anonymous.** You want to know *which crawler read which page*, not who. Store the path without its query string and never the IP address.

A user agent is something a client *claims*, so this tells you about honest crawlers only. That's still useful: it shows you whether AI tools are reading the pages you've optimised for them.

## Your turn

Open `netlify/edge-functions/crawler-log.mjs`.

1. Write `detectCrawler` so it recognises each name in `AI_CRAWLERS`, in any letter case, and returns `null` for everything else.
2. Write `logHit`: key `YYYY-MM-DD/<crawler>`, value `{ count, lastSeen, lastPath }`, adding one each visit.
3. Finish `makeHandler`: log crawler visits using `context.waitUntil`, never let a failure escape, and always return `context.next()`.
4. Add the `config` export with `path: '/*'` and an `excludedPath` list for static files.
5. Press **Check my work**.
