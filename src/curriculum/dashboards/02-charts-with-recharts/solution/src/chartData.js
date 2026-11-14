/**
 * One sentence that describes a chart in words, for people who can't see it.
 * describeSeries(months, 'revenue', 'Revenue by month', formatMoney) is
 * "Revenue by month. Highest in Dec at $84,200, lowest in Feb at $58,900."
 * (The label of each point is its "month" field.)
 */
export function describeSeries(data, key, title, format) {
  const high = data.reduce((best, row) => (row[key] > best[key] ? row : best));
  const low = data.reduce((best, row) => (row[key] < best[key] ? row : best));
  return `${title}. Highest in ${high.month} at ${format(high[key])}, lowest in ${low.month} at ${format(low[key])}.`;
}
