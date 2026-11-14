import { useId } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatMoney, formatThousands } from '../format.js';

/** One sentence that tells someone who can't see the chart what it shows. */
export function describeSeries(series, periodLabel) {
  const high = series.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  const low = series.reduce((a, b) => (b.revenue < a.revenue ? b : a));
  return `Revenue, ${periodLabel.toLowerCase()}. Highest in ${high.label} at ${formatMoney(high.revenue)}, lowest in ${low.label} at ${formatMoney(low.revenue)}.`;
}

// The chart is a named figure. The drawing is role="img" with a sentence for a label, and the same numbers sit beside it as a real table.
export default function RevenueChart({ series, periodLabel }) {
  const id = useId();
  return (
    <figure className="panel chart" aria-labelledby={id}>
      <figcaption id={id} className="panel__title">
        Revenue, {periodLabel.toLowerCase()}
      </figcaption>
      <div className="chart__plot" role="img" aria-label={describeSeries(series, periodLabel)}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series}>
            <CartesianGrid vertical={false} stroke="#263041" />
            <XAxis dataKey="label" tick={{ fill: '#a3afc2' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatThousands} tick={{ fill: '#a3afc2' }} axisLine={false} tickLine={false} width={52} />
            <Bar dataKey="revenue" fill="#4cc9f0" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="chart__data">
        <summary>View the numbers as a table</summary>
        <table className="data">
          <caption className="sr-only">Revenue, {periodLabel.toLowerCase()}</caption>
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Revenue</th>
              <th scope="col">Orders</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.label}>
                <th scope="row">{s.label}</th>
                <td>{formatMoney(s.revenue)}</td>
                <td>{s.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
