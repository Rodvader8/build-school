# Tickets for tinyshop

You've just joined the team. Three tickets are waiting. You haven't seen this code before, and nobody's free to walk you through it.

1. **Free shipping starts at $75, not $50.** Customers have been asking why a $60 order still pays postage.
2. **The receipt should name the promo code.** The discount line should read `Discount (SAVE10)` instead of just `Discount`.
3. **Gift cards must never be discounted.** If someone buys a $50 gift card and a $50 mug with SAVE10, the discount is $5 (10% of the mug), not $10.

Rules of the job:

- Don't change `check.mjs`. It's the acceptance check.
- Keep `npm test` (that is, `node --test`) green, and add at least one test for the gift card rule.
- Fill in `NOTES.md` as you go. It's what you'd leave for the next new starter.
