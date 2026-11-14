import { HEAT_CLASSES, HEAT_TEXT, heatLevel } from '../heat.js';
import HeatLegend from './HeatLegend.jsx';

/**
 * A heat grid is a table whose cells are shaded by value. Because it's a real table, rows and columns have headers,
 * and every cell prints its number, so colour is never the only way to read it.
 * values[row][col] lines up with rowLabels[row] and colLabels[col].
 */
export default function HeatGrid({ title, rowLabels, colLabels, values, formatValue, describe, lowLabel, highLabel }) {
  const max = Math.max(...values.flat());

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <table className="w-full border-separate border-spacing-1 text-center text-sm">
        <caption className="mb-3 text-left text-lg font-semibold">{title}</caption>
        <thead>
          <tr>
            <td />
            {colLabels.map((col) => (
              <th key={col} scope="col" className="pb-1 font-medium text-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((row, r) => (
            <tr key={row}>
              <th scope="row" className="pr-2 text-left font-medium text-muted">
                {row}
              </th>
              {colLabels.map((col, c) => {
                const level = heatLevel(values[r][c], max);
                return (
                  <td
                    key={col}
                    data-level={level}
                    aria-label={describe(row, col, values[r][c])}
                    className={`rounded-md py-2 tabular-nums ${HEAT_CLASSES[level]} ${HEAT_TEXT[level]}`}
                  >
                    {formatValue(values[r][c])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <HeatLegend lowLabel={lowLabel} highLabel={highLabel} />
    </div>
  );
}
