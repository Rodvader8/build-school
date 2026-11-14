import { subtotal } from './cart/cart.js';
import { applyPromo } from './pricing/discounts.js';
import { gstIncluded } from './pricing/tax.js';
import { shippingFor } from './shipping/shipping.js';

// Turns a cart (and an optional promo code) into an order summary. All amounts are cents.
export function checkout(cart, promoCode) {
  const sub = subtotal(cart);
  const discount = applyPromo(cart, promoCode);
  const payable = sub - discount.cents;
  const shipping = shippingFor(payable);
  return {
    subtotal: sub,
    discount,
    shipping,
    total: payable + shipping,
    gst: gstIncluded(payable + shipping),
  };
}
