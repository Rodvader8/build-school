const dollars = (cents) => `$${(Math.abs(cents) / 100).toFixed(2)}`;
const line = (label, value) => label.padEnd(14) + value;

// The text printed at the bottom of an order.
export function formatReceipt(order) {
  const rows = [line('Subtotal', dollars(order.subtotal))];
  if (order.discount.cents > 0) rows.push(line('Discount', '-' + dollars(order.discount.cents)));
  rows.push(line('Shipping', order.shipping === 0 ? 'Free' : dollars(order.shipping)));
  rows.push(line('Total', dollars(order.total)));
  rows.push(line('Includes GST', dollars(order.gst)));
  return rows.join('\n');
}
