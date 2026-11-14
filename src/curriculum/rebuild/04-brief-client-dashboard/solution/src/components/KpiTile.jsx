export default function KpiTile({ label, value, delta }) {
  return (
    <article className="kpi" data-testid="kpi">
      <p className="kpi__label">{label}</p>
      <p className="kpi__value">{value}</p>
      <p className={`kpi__change ${delta.up ? 'kpi__change--up' : 'kpi__change--down'}`}>
        {delta.up ? 'Up' : 'Down'} {delta.text} on the period before
      </p>
    </article>
  );
}
