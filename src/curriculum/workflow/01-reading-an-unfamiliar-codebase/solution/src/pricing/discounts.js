import { PROMO_CODES } from '../config/rules.js';

// Returns { code, cents }: the promo that applied and how much it takes off.
// Gift cards are never discounted.
export function applyPromo(cart, code) {
  const rate = PROMO_CODES[code];
  if (!rate) return { code: null, cents: 0 };
  const eligible = cart.items.filter((item) => item.type !== 'giftcard').reduce((sum, item) => sum + item.priceCents * item.qty, 0);
  return { code, cents: Math.round(eligible * rate) };
}
