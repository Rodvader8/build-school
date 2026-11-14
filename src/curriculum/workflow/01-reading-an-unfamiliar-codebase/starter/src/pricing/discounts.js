import { PROMO_CODES } from '../config/rules.js';
import { subtotal } from '../cart/cart.js';

// Returns { code, cents }: the promo that applied and how much it takes off.
export function applyPromo(cart, code) {
  const rate = PROMO_CODES[code];
  if (!rate) return { code: null, cents: 0 };
  return { code, cents: Math.round(subtotal(cart) * rate) };
}
