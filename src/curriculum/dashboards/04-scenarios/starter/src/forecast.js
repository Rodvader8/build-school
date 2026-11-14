/**
 * A month-by-month cash forecast. Returns [{ month, income, outgoings, balance }], months numbered from 1.
 *
 *   opening   the balance before month 1
 *   revenue   income in month 1; it grows by `growth` (0.02 means 2%) each month after
 *   costs     outgoings every month
 *   hire      optional { salary, startMonth, rampMonths = 2, extraRevenue = 0 }
 *               from startMonth, outgoings go up by salary
 *               from startMonth + rampMonths, income goes up by extraRevenue
 *   balance   the previous balance + income - outgoings (round each number to cents)
 */
export function forecastCash({ opening, months, revenue, growth = 0, costs, hire }) {
  // TODO
  return [];
}

/** The month with the smallest balance: { month, balance }. The earliest one wins a tie. */
export function lowestBalance(series) {
  // TODO
  return { month: 1, balance: 0 };
}

/** The first month the balance drops below zero, or null if it never does. */
export function cashOutMonth(series) {
  // TODO
  return null;
}
