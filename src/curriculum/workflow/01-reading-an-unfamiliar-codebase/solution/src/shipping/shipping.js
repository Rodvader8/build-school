import { FLAT_SHIPPING_CENTS, FREE_SHIPPING_FROM_CENTS } from '../config/rules.js';

// What the customer pays to have the order sent. Takes the amount after any discount.
export function shippingFor(amountCents) {
  return amountCents >= FREE_SHIPPING_FROM_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}
