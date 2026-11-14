A static site can't do anything on its own: it can show a form, but when someone presses Send there's nowhere for the details to go. A **Netlify Function** is a small piece of server code that wakes up when a request arrives, does its job and goes back to sleep. For a business site, the classic job is: take an enquiry and put it in the CRM, so the lead is in the system before you've finished your coffee.

## The shape of a function

Netlify Functions (the current "v2" style) are a standard web handler: a `Request` goes in and a `Response` comes out.

```js
export default async (req) => {
  return new Response('Hello', { status: 200 });
};

export const config = { path: '/api/enquiry' };
```

`config.path` gives it a friendly URL. There's no framework to learn: it's the same `Request`, `Response` and `fetch` you already know from the browser.

## What a safe enquiry handler does

Work through it in a sensible order, and return as soon as you know the answer.

1. **Check the method.** Only `POST` is allowed. Reply `405` otherwise.
2. **Check it's configured.** If the CRM address or key is missing, reply `500` with a vague message and log a short note. Never explain your setup to the public.
3. **Read the body** (JSON, or a normal HTML form) and reply `400` if it's broken.
4. **Honeypot.** The form has an extra field, `website`, hidden from people with CSS. Humans leave it empty, bots fill in everything. If it has anything in it, reply a cheerful `200` and do nothing. Telling the bot it failed only teaches it.
5. **Validate.** A name, a plausible email, a message of a sensible length. Reply `400` and say *which* fields.
6. **Call the CRM** with `fetch`, sending the key as `Authorization: Bearer ...`. If it fails, reply `502` ("bad gateway").

## Secrets and personal data

The CRM key lives in an environment variable, read with `process.env.CRM_API_KEY`. Never type it into the code: code goes into Git and Git remembers forever. Locally the variable comes from a `.env` file that is **git-ignored**; `.env.example` shows the names with fake values so a teammate knows what to set. On Netlify you set the real value in the dashboard.

And a rule people forget: **don't log personal data.** Logs are kept, searched and shared with support staff. `console.log(body)` quietly copies every customer's name and email into a second, less protected place. Log a status code or a reason, never the person.

## Testing without a CRM

Check my work never touches Netlify or a real CRM. It starts a pretend CRM on your own machine, points `CRM_URL` at it, then imports your function and calls it with real `Request` objects. That's exactly how you'd unit-test one at work.

## Your turn

1. Open `netlify/functions/enquiry.mjs`. The starter hard-codes the key, logs everything and checks nothing.
2. Work through the six steps above, in order.
3. Remove the hard-coded key. Read `CRM_URL` and `CRM_API_KEY` from `process.env`.
4. Make sure the file `.gitignore` lists `.env`.
5. Press **Check my work**.
