import test from 'node:test';
import assert from 'node:assert/strict';
import { createCart, addItem } from '../src/cart/cart.js';
import { checkout } from '../src/index.js';
import { formatReceipt } from '../src/receipt/format.js';

const cartOf = (...items) => items.reduce((cart, item) => addItem(cart, item), createCart());
const mug = { sku: 'MUG', name: 'Mug', priceCents: 2000, qty: 1 };

test('a small order pays flat shipping', () => {
  const order = checkout(cartOf(mug));
  assert.equal(order.shipping, 795);
  assert.equal(order.total, 2795);
});

test('a big order ships free', () => {
  const order = checkout(cartOf({ ...mug, priceCents: 10000 }));
  assert.equal(order.shipping, 0);
});

test('SAVE10 takes ten percent off', () => {
  const order = checkout(cartOf({ ...mug, priceCents: 10000 }), 'SAVE10');
  assert.equal(order.discount.cents, 1000);
});

test('an unknown code does nothing', () => {
  assert.equal(checkout(cartOf(mug), 'NOPE').discount.cents, 0);
});

test('the receipt has a total line', () => {
  assert.match(formatReceipt(checkout(cartOf(mug))), /Total\s+\$27\.95/);
});

test('gift cards are not discounted', () => {
  const giftCard = { sku: 'GC', name: 'Gift card', priceCents: 5000, qty: 1, type: 'giftcard' };
  const order = checkout(cartOf({ ...mug, priceCents: 5000 }, giftCard), 'SAVE10');
  assert.equal(order.discount.cents, 500);
});
