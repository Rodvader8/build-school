// A headline number with how it moved. Whether "up" is good depends on the number: more revenue is good, more labour cost isn't.
export default function KpiTile({ label, value, change, goodWhenUp = true }) {
  const flat = change === 0;
  const up = change > 0;
  const good = up === goodWhenUp;
  const tone = flat ? 'neutral' : good ? 'good' : 'bad';
  const toneClass = { good: 'text-good', bad: 'text-bad', neutral: 'text-muted' }[tone];

  return (
    <section data-tone={tone} className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-sm font-medium text-muted">{label}</h2>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      {/* The words carry the meaning. Colour and the arrow only back them up. */}
      <p className={`mt-1 text-sm ${toneClass}`}>
        {!flat && (
          <span aria-hidden="true" className="mr-1">
            {up ? '▲' : '▼'}
          </span>
        )}
        {flat ? 'No change' : `${up ? 'Up' : 'Down'} ${Math.abs(change).toFixed(1)}%`} on last month
      </p>
    </section>
  );
}
