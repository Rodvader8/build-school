// check.mjs: Check my work runs this file. Read it, but don't change it.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { createCart, addItem } = await import('./src/cart/cart.js');
const { checkout } = await import('./src/index.js');
const { formatReceipt } = await import('./src/receipt/format.js');
const { shippingFor } = await import('./src/shipping/shipping.js');

function check(name, test) {
  let ok = false;
  try {
    ok = !!test();
  } catch (error) {
    console.log(`  (${name} raised ${error.message})`);
  }
  console.log((ok ? 'PASS ' : 'FAIL ') + name);
}

const cartOf = (...items) => items.reduce((cart, item) => addItem(cart, item), createCart());
const mug = (priceCents) => ({ sku: 'MUG', name: 'Mug', priceCents, qty: 1 });
const giftCard = (priceCents) => ({ sku: 'GC', name: 'Gift card', priceCents, qty: 1, type: 'giftcard' });

check('free shipping starts at $75', () => shippingFor(7499) === 795 && shippingFor(7500) === 0 && checkout(cartOf(mug(6000))).shipping === 795);
check('the receipt names the promo code', () => /Discount \(SAVE10\)\s+-\$10\.00/.test(formatReceipt(checkout(cartOf(mug(10000)), 'SAVE10'))));
check('the receipt still has no discount line without a code', () => !/Discount/.test(formatReceipt(checkout(cartOf(mug(2000))))));
check('gift cards are not discounted', () => checkout(cartOf(mug(5000), giftCard(5000)), 'SAVE10').discount.cents === 500);
check('a cart of only gift cards gets no discount', () => checkout(cartOf(giftCard(8000)), 'SAVE10').discount.cents === 0);
check('ordinary discounts and totals still work', () => {
  const order = checkout(cartOf(mug(10000)), 'SAVE10');
  return order.discount.cents === 1000 && order.total === 9000 && checkout(cartOf(mug(2000))).total === 2795;
});

const tests = spawnSync(process.execPath, ['--test', '--test-reporter=tap'], { encoding: 'utf8' });
const counts = (key) => Number((new RegExp(`^# ${key} (\\d+)`, 'm').exec(tests.stdout) ?? [])[1] ?? 0);
check('npm test passes', () => tests.status === 0 && counts('pass') >= 5);
check('you added a test for the gift card rule', () => counts('pass') >= 6 && /giftcard/.test(readFileSync('tests/checkout.test.js', 'utf8')));

const notes = readFileSync('NOTES.md', 'utf8');
check('NOTES.md says where each thing lives', () => ['src/config/rules.js', 'src/pricing/discounts.js', 'src/receipt/format.js', 'src/index.js'].every((path) => notes.includes(path)));
