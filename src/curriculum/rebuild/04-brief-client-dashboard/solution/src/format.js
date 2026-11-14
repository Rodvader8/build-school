const money = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
const money2 = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 });
const date = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatMoney = (value) => money.format(value);
export const formatMoneyExact = (value) => money2.format(value);
export const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;
export const formatDate = (iso) => date.format(new Date(`${iso}T00:00:00`));

/** How far a figure has moved from the previous period: { text: "4.6%", up: true }. */
export function change(current, previous) {
  const pct = ((current - previous) / previous) * 100;
  return { text: `${Math.abs(pct).toFixed(1)}%`, up: pct >= 0 };
}

/** Percentage points, for measures that are already percentages (repeat rate). */
export function changePoints(current, previous) {
  const pts = (current - previous) * 100;
  return { text: `${Math.abs(pts).toFixed(1)} points`, up: pts >= 0 };
}

/** Axis labels: 4500 becomes $4.5k. */
export const formatThousands = (value) => `$${value / 1000}k`;
