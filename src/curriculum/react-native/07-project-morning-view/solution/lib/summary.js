// The numbers behind the screen. They're plain functions with no React in them, so they're easy to test and easy to reuse.

/** 18 of 24 is 75. Whole numbers only, and 0 (not NaN) when there are no rooms. */
export function occupancyPercent(occupied, total) {
  return total > 0 ? Math.round((occupied / total) * 100) : 0;
}

/** Earliest arrival first. Times are "HH:MM" strings, which sort correctly as text. Returns a new array. */
export function sortByArrival(arrivals) {
  return [...arrivals].sort((a, b) => a.eta.localeCompare(b.eta));
}

/** Arrivals due before 14:00. */
export function earlyArrivals(arrivals) {
  return arrivals.filter((a) => a.eta < '14:00');
}
