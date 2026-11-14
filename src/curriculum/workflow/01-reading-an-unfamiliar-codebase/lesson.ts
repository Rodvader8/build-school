import type { LessonMeta } from '../../types';
import { outputChecks } from '../../helpers';

export default {
  title: 'Reading an unfamiliar codebase',
  minutes: 40,
  kind: 'node',
  entry: 'TASKS.md',
  checkEntry: 'check.mjs',
  checks: outputChecks([
    'free shipping starts at $75',
    'the receipt names the promo code',
    'the receipt still has no discount line without a code',
    'gift cards are not discounted',
    'a cart of only gift cards gets no discount',
    'ordinary discounts and totals still work',
    'npm test passes',
    'you added a test for the gift card rule',
    'NOTES.md says where each thing lives',
  ]),
  hints: [
    'Don\'t read every file. Search for the words in the ticket: grep -rn "shipping" src, then grep -rn "Discount" src. The hit tells you the file, and the file\'s imports tell you who else is involved.',
    'Start at src/index.js: it\'s the one file that calls everything else, so it shows the order things happen in. Then open only the file the ticket is about.',
    'The receipt can only print what the order carries. Log an order with console.log(checkout(cart, "SAVE10")) to see which fields exist before you edit the formatter.',
  ],
} satisfies LessonMeta;
