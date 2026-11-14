Free text is fine for a chat box. It's useless for a booking system, a spreadsheet or a PDF, which all need data in a known shape. So when Claude's output feeds other code, you ask for JSON, and you check it before you trust it.

## Ask for a shape, then check the shape

Two separate jobs, and both matter:

1. **Ask.** The API can constrain a reply to a JSON Schema with `output_config.format`. It makes broken output rare.
2. **Check.** Rare isn't never. A reply can still be cut off, refused or wrong. Your code validates every reply, every time.

One zod schema can do both. The SDK turns it into the schema the API wants:

```js
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

const PlanSchema = z.object({
  title: z.string(),
  guests: z.number().int().min(1),
});

const message = await claude.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 2000,
  output_config: { format: zodOutputFormat(PlanSchema) },
  messages: [{ role: 'user', content: brief }],
});
```

The API doesn't enforce every rule you can write in zod (a minimum, a regex), so keep the strict version on your side and let `safeParse` have the last word.

## Four ways it goes wrong

Check them in this order, because each one makes the next meaningless:

| What happened | How you spot it | What you do |
|---|---|---|
| The model declined | `stop_reason === 'refusal'` (content can be empty) | Tell the user, don't retry blindly |
| It ran out of room | `stop_reason === 'max_tokens'` | JSON cut mid-way will never parse. Raise the limit or shorten the ask |
| It isn't JSON | `JSON.parse` throws | Treat as a failure |
| It's JSON, wrong shape | `safeParse` returns `success: false` | Report which fields, using `error.issues` |

`parse` throws on failure and `safeParse` hands you the result, so there's no try/catch for shape problems. Wrap only `JSON.parse`.

A tidy way to carry all this is one error class with a `kind`. The route then turns each kind into a status (422 refused, 502 for the model's other failures) and a plain message. The page never sees a stack trace.

> In a real app you'd also decide what happens next: retry once for a malformed reply, or show a "try rewording" message for a refusal. That's a product decision, so it belongs in the route, not buried in the helper. Refusals can also be rescued automatically by naming a fallback model. That's an API option you can read about in Anthropic's docs once you're calling the real thing.

## Your turn

1. In the terminal, run `npm install`, then `cp .env.example .env`. Press **Start dev server** above the preview and press "Plan it". It can't plan yet, because there's no route to call.
2. Open `tests/plan.test.js`. The pretend API can misbehave on purpose: words like `[mock:refusal]` or `[mock:truncate]` in a brief trigger each failure.
3. In `lib/schema.js`, make the schema strict so that nonsense (zero guests, "half past four") fails.
4. In `lib/plan.js`, add the three checks: `stop_reason`, `JSON.parse`, then `safeParse`. Throw a `PlanError` with the right `kind` each time.
5. Create `app/api/plan/route.js`. Return `400` for an empty brief, and map each `PlanError` kind to a status. Include `kind` and `issues` in the body, and never a partial plan.
6. Once the route exists, try `[mock:refusal]` in the brief on the page and read what the visitor sees.
7. Press **Check my work**.
