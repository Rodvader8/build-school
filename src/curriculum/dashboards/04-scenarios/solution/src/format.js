const money = (digits) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: digits, maximumFractionDigits: digits });

/** formatMoney(835800) is "$835,800". formatMoney(39.239, 2) is "$39.24". */
export function formatMoney(amount, digits = 0) {
  return money(digits).format(amount);
}

/** formatPercent(29.07) is "29.1%". */
export function formatPercent(value, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

/** How much a number changed, as a percentage of where it was. 0 when there was nothing before. */
export function changePct(current, previous) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}
