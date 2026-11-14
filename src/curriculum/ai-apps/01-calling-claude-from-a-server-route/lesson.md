A "smart" feature in an app is usually one HTTP request to a model, made from your server. This lesson builds the smallest useful version: a question box for a small events venue, where the browser asks your own `/api/ask` route and only the server talks to Claude.

## Why the server, always

Calling Claude takes an API key, and that key spends money. Anything in client code (a React component, anything starting `NEXT_PUBLIC_`) is shipped to every visitor, and anyone can open dev tools and copy it. So the rule has no exceptions:

- the key lives in an **environment variable** on the server,
- only server files (`lib/`, `app/api/`) touch the SDK,
- the browser calls *your* route, and your route calls Claude.

## The SDK in four lines

```js
import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await claude.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 1024,
  system: 'You are the front-of-house assistant for a small venue.',
  messages: [{ role: 'user', content: 'Can we bring our own cake?' }],
});
```

`max_tokens` is a hard ceiling on the reply, and it's required. `system` sets the role and rules. The answer isn't a string: `message.content` is a list of **blocks**, and a plain answer is `[{ type: 'text', text: '...' }]`. `message.usage` tells you how many tokens went in and out, which is what you're billed for.

## No real calls in this course

You won't spend a cent here. The SDK takes a `baseURL`, so this project points it at a **pretend Anthropic API** (`mock/`) that returns the same JSON shapes as the real one. The tests start it on a spare port, and the dev server serves it under `/mock`. Your code doesn't know the difference, and that's the point: swap the address and key, and it's the real thing.

> To try the real API later: put your own key in `.env` as `ANTHROPIC_API_KEY=...`, empty the `CLAUDE_BASE_URL` line, and restart. Real calls cost money, so set a spending limit in your Anthropic account first. Never paste a key into a lesson file or a chat.

## Your turn

1. In the terminal, run `npm install`.
2. Run `cp .env.example .env` in the terminal. That's your local settings file (it's git-ignored). Then press **Start dev server** above the preview and try the question box. It'll say it can't answer yet.
3. Open `tests/ask.test.js`. It shows exactly what the server should do.
4. In `lib/claude.js`, stop typing the key and address into the code. Read `process.env.ANTHROPIC_API_KEY`, and `process.env.CLAUDE_BASE_URL` for the address (the real API's address when it's empty), and throw `MissingKeyError` if the key is empty.
5. In `lib/ask.js`, write `askClaude`: call `messages.create`, join the text blocks, and return the answer with the token usage.
6. Create `app/api/ask/route.js` with a `POST`. Return `400` for a bad question, `500` if the key's missing, and `502` if Claude's API fails. Never send the raw error back.
7. Restart the dev server (stop it, then press Start again) so it picks up `.env`, and ask something.
8. Press **Check my work**.

The error messages matter. A visitor should see "The AI service could not answer that just now", not a stack trace or a header with your key in it.
