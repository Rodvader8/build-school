/** A sorted copy of the rows. dir is "asc" or "desc"; text sorts alphabetically, numbers numerically. */
export function sortRows(rows, key, dir) {
  const sign = dir === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    return sign * (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'en-AU'));
  });
}
