import { useId } from 'react';

/**
 * The accessible frame every chart goes in:
 *  - a <figure> named by its <figcaption>
 *  - the drawing itself as role="img" with a one-sentence summary (screen readers skip the SVG inside)
 *  - the same numbers as a real table, tucked into a <details>, for anyone who wants the detail
 */
export default function ChartFigure({ title, summary, columns, rows, children }) {
  const id = useId();

  return (
    <figure aria-labelledby={id} className="rounded-2xl border border-line bg-surface p-5">
      <figcaption id={id} className="text-lg font-semibold">
        {title}
      </figcaption>
      <div role="img" aria-label={summary} className="mt-4 h-72">
        {children}
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted focus-visible:outline-2 focus-visible:outline-accent">View as a table</summary>
        <table className="mt-2 w-full">
          <caption className="sr-only">{title}</caption>
          <thead className="text-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="py-1 text-left font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[columns[0].key]} className="border-t border-line">
                {columns.map((column) => (
                  <td key={column.key} className="py-1 tabular-nums">
                    {column.format ? column.format(row[column.key]) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
