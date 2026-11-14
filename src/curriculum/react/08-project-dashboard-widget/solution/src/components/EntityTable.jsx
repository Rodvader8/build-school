import { money } from '../format.js';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'value', label: 'Value' },
  { key: 'return', label: 'Return' },
];

export default function EntityTable({ rows, period, sort, onSort }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Entities</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" aria-sort={sort.key === c.key ? sort.dir : 'none'} className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort(c.key)}
                  className="font-medium text-muted hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:transition-colors"
                >
                  {c.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => {
            const change = e.returns[period];
            return (
              <tr key={e.id} className="border-t border-line">
                <td className="px-4 py-3">{e.name}</td>
                <td className="px-4 py-3 text-muted">{e.type}</td>
                <td className="px-4 py-3">{money(e.value)}</td>
                <td className={`px-4 py-3 ${change >= 0 ? 'text-good' : 'text-bad'}`}>{change.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
