An AI feature that works in a demo can still be a bad business if each click costs more than it earns. The good news is that cost is predictable: every response tells you exactly what it used, and a few habits keep the bill small.

## Read the usage numbers

Every message comes back with `usage`:

```js
{ input_tokens: 412, output_tokens: 96, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
```

Prices are per million tokens, and output costs several times more than input. So `cost = (input * inputPrice + output * outputPrice) / 1,000,000`, plus the cache terms below. Work it out from the real numbers, every call, and show it somewhere you'll see it. Prices change, so keep them in one file and check Anthropic's pricing page.

## Use the smallest model that does the job

Sorting an enquiry into "wedding", "corporate" or "other" doesn't need the strongest model. `claude-haiku-5-5` costs a fraction of `claude-opus-5-5` and is plenty. Writing a careful reply from a handbook is worth the bigger one. Putting that choice in a function (`chooseModel('classify')`) means one place to change it and one place to test it.

> Models that think before answering count those thinking tokens towards `max_tokens`. Give even a one-word step some room (a few hundred) and set `output_config: { effort: 'low' }`, or the answer can be cut off before it appears.

## Cache the part that never changes

If every request starts with the same 3,000-word handbook, you're paying full price to resend it each time. Mark it as cacheable and later requests read it back for a tenth of the price:

```js
system: [{ type: 'text', text: VENUE_GUIDE, cache_control: { type: 'ephemeral' } }],
```

Caching matches a **prefix**, byte for byte. So the handbook goes first and nothing that changes goes inside it: no timestamps, no customer names. The enquiry goes in `messages`, after it. The first request pays a quarter extra to write the cache, and later ones read it. Check it's working by watching `cache_read_input_tokens`. If that stays at zero, something in the prefix is changing. Also, a prefix shorter than the model's minimum silently won't cache, so look up the minimum for the model you use.

## A budget guard

Before an expensive call, work out the worst case and refuse if it's too much. Counting tokens is free: `claude.messages.countTokens({ model, system, messages })` returns `{ input_tokens }` without running the model. Assume the reply uses all of `max_tokens`, ignore the cache discount, and compare with a limit from the environment. A bug that loops, or a visitor who pastes a novel, then hits a wall instead of your wallet.

## Your turn

1. In the terminal, run `npm install`, then `cp .env.example .env`. Press **Start dev server** above the preview and draft a reply. Look at the cost line under it.
2. Open `tests/costs.test.js`. The pretend API reports usage numbers the same way the real one does, including cache reads.
3. In `lib/pricing.js`, make `costOf` count cache writes and reads, and throw for an unknown model.
4. In `lib/models.js`, send `classify` to the small model.
5. In `lib/budget.js`, write `guardBudget` so it counts tokens, estimates the worst case and throws `BudgetError` when it's over the limit.
6. In `lib/triage.js`, make the handbook a cached system block and call `guardBudget` before the expensive request.
7. Draft two replies in a row and compare the "cached" numbers. Then set `MAX_REQUEST_USD=0.001` in `.env`, restart, and watch the guard refuse.
8. Press **Check my work**.
