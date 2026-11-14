// A table that reads well for everyone: a caption, proper headers, right-aligned figures that line up.
export default function DataTable({ caption, columns, rows, totals }) {
  const cell = (column) => (column.numeric ? 'px-4 py-3 text-right tabular-nums' : 'px-4 py-3 text-left');
  const show = (column, value) => (column.format ? column.format(value) : value);

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-muted">
          <tr className="border-b border-line">
            {columns.map((column) => (
              <th key={column.key} scope="col" className={`${cell(column)} font-medium`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-0">
              {columns.map((column, i) =>
                i === 0 ? (
                  <th key={column.key} scope="row" className={`${cell(column)} font-medium`}>
                    {show(column, row[column.key])}
                  </th>
                ) : (
                  <td key={column.key} className={cell(column)}>
                    {show(column, row[column.key])}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
        {totals && (
          <tfoot>
            <tr className="border-t border-line font-semibold">
              {columns.map((column, i) => {
                const value = i === 0 ? 'Total' : column.key in totals ? show(column, totals[column.key]) : '';
                return i === 0 ? (
                  <th key={column.key} scope="row" className={cell(column)}>
                    {value}
                  </th>
                ) : (
                  <td key={column.key} className={cell(column)}>
                    {value}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
