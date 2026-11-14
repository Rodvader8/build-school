const cents = (n) => Math.round(n * 100) / 100;

/**
 * A month-by-month cash forecast. Returns [{ month, income, outgoings, balance }], months numbered from 1.
 *
 *   opening   the balance before month 1
 *   revenue   income in month 1; it grows by `growth` (0.02 means 2%) each month after
 *   costs     outgoings every month
 *   hire      optional { salary, startMonth, rampMonths = 2, extraRevenue = 0 }
 *               from startMonth, outgoings go up by salary
 *               from startMonth + rampMonths, income goes up by extraRevenue
 *   balance   the previous balance + income - outgoings
 */
export function forecastCash({ opening, months, revenue, growth = 0, costs, hire }) {
  const { salary = 0, startMonth = Infinity, rampMonths = 2, extraRevenue = 0 } = hire ?? {};
  const series = [];
  let balance = opening;
  for (let month = 1; month <= months; month++) {
    const income = revenue * (1 + growth) ** (month - 1) + (month >= startMonth + rampMonths ? extraRevenue : 0);
    const outgoings = costs + (month >= startMonth ? salary : 0);
    balance += income - outgoings;
    series.push({ month, income: cents(income), outgoings: cents(outgoings), balance: cents(balance) });
  }
  return series;
}

/** The month with the smallest balance: { month, balance }. The earliest one wins a tie. */
export function lowestBalance(series) {
  return series.reduce((low, row) => (row.balance < low.balance ? { month: row.month, balance: row.balance } : low), { month: series[0].month, balance: series[0].balance });
}

/** The first month the balance drops below zero, or null if it never does. */
export function cashOutMonth(series) {
  return series.find((row) => row.balance < 0)?.month ?? null;
}
