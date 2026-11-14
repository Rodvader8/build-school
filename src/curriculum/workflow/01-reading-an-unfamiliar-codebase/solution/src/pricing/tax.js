import { GST_RATE } from '../config/rules.js';

// Prices already include GST. This works out how much of an amount is GST.
export function gstIncluded(amountCents) {
  return Math.round(amountCents - amountCents / (1 + GST_RATE));
}
