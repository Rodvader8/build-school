Not everything is a page. A contact form needs somewhere to send its data, and in Next.js that's a **route handler**: a function in a `route.js` file that answers an HTTP request. It's the same idea as the small servers you met in the APIs and Node tracks, but it lives inside your site, and you deploy it together.

## The shape of one

```js
// app/api/enquiry/route.js  ->  POST /api/enquiry
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ ok: true }, { status: 201 });
}
```

Export a function named after the method (`GET`, `POST`...). Anything you don't export gets a 405 automatically. Under Next 16's caching model only `GET` handlers can be prerendered. A `POST` always runs when it's called.

You can call it straight from a test, because it's just a function that takes a `Request` and returns a `Response`. That's how this lesson's checks work.

## A public URL is a public door

Anyone can send anything to `/api/enquiry`: broken JSON, ten thousand characters, a script tag. So the handler:

1. **Parses safely.** `request.json()` throws on bad input. Catch it and answer `400`.
2. **Validates every field on the server.** The browser's checks help people, but they don't protect you.
3. **Answers with the right status.** `201` created, `400` for bad input, with a message per field so the form can show it.

## Honeypot

Bots fill in every field they find. Add one the people can't see (moved off-screen, `aria-hidden`, `tabIndex={-1}`), and if it comes back filled, you know it was a bot. Reply as if it worked, so the bot doesn't learn anything, and quietly send nothing.

## Secrets live in the environment

The address where enquiries go is a secret. It's read from `process.env`, never typed into the code:

```js
const url = process.env.ENQUIRY_WEBHOOK_URL;
```

Locally it goes in a `.env` file, which is git-ignored. You commit `.env.example` instead, with the names and **fake** values, so anyone cloning the project knows what to set. On a host, you set the same names in its dashboard. Next loads `.env` for you, and only variables starting `NEXT_PUBLIC_` are ever sent to the browser.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. Open `/contact` in the preview to see the form (it can't send yet).
2. Open the three files in `tests/`. They show exactly what the server should do.
3. Write `validateEnquiry` in `lib/validate.js`.
4. Open `app/api/enquiry/route.js` (it's waiting for you, with a note) and write a `POST` that parses, checks the honeypot, validates and sends.
5. In `lib/notify.js`, replace the hard-coded address with `process.env.ENQUIRY_WEBHOOK_URL`.
6. Create `.env.example` with `ENQUIRY_WEBHOOK_URL` and a fake value.
7. Press **Check my work**.

> Tip: to see the whole thing work, create a `.env` containing a webhook address you own and restart the dev server. Checks never call a real address, and `.env` is never committed.
