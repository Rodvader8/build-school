// The numbers behind the screen. They're plain functions with no React in them, so they're easy to test and easy to reuse.

/** 18 of 24 is 75. Whole numbers only (round it), and 0 (not NaN) when there are no rooms. */
export function occupancyPercent(occupied, total) {
  return occupied / total;
}

/** Earliest arrival first. Times are "HH:MM" strings, which sort correctly as text. Return a NEW array: don't sort the original. */
export function sortByArrival(arrivals) {
  return arrivals;
}

/** Arrivals due before 14:00. */
export function earlyArrivals(arrivals) {
  return arrivals;
}
