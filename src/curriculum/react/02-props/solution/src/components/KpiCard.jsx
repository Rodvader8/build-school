const money = (n) => '$' + n.toLocaleString('en-AU');

export default function KpiCard({ label, value, change, children }) {
  const direction = change < 0 ? 'down' : 'up';

  return (
    <section className="card">
      <h2>{label}</h2>
      <p className="kpi-value">{money(value)}</p>
      {change !== undefined && (
        <p className={`kpi-change is-${direction}`}>
          {direction === 'up' ? 'Up' : 'Down'} {Math.abs(change)}%
        </p>
      )}
      {children}
    </section>
  );
}
