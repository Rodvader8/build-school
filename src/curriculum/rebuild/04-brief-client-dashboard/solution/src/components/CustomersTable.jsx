import { useState } from 'react';
import { sortRows } from '../sort.js';
import { formatDate, formatMoney } from '../format.js';

const columns = [
  { key: 'customer', label: 'Customer' },
  { key: 'orders', label: 'Orders', numeric: true },
  { key: 'revenue', label: 'Revenue', numeric: true, format: formatMoney },
  { key: 'last', label: 'Last order', format: formatDate },
];

// Each column header is a real button, so the table sorts from the keyboard. aria-sort tells a screen reader the order.
export default function CustomersTable({ rows }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const shown = sort.key ? sortRows(rows, sort.key, sort.dir) : rows;

  const toggle = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="scroll" role="region" aria-label="Customers, scrollable" tabIndex={0}>
      <table className="data data--wide">
        <caption className="sr-only">Customers by orders and revenue. Use the column buttons to sort.</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={c.numeric ? 'num' : undefined} aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button type="button" className="sort" onClick={() => toggle(c.key)}>
                  {c.label}
                  <span className="sort__mark" aria-hidden="true">{sort.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : '▴'}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.customer}>
              {columns.map((c) =>
                c.key === 'customer' ? (
                  <th key={c.key} scope="row">{r.customer}</th>
                ) : (
                  <td key={c.key} className={c.numeric ? 'num' : undefined}>{c.format ? c.format(r[c.key]) : r[c.key]}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
