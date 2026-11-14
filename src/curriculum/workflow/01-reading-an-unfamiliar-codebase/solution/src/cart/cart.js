export function createCart() {
  return { items: [] };
}

// An item looks like { sku, name, priceCents, qty, type }. type is "physical" or "giftcard".
export function addItem(cart, item) {
  cart.items.push({ qty: 1, type: 'physical', ...item });
  return cart;
}

export function subtotal(cart) {
  return cart.items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
}
