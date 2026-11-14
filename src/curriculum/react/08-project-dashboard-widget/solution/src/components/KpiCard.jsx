export default function KpiCard({ label, value, change, caption }) {
  const up = change >= 0;
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-sm font-medium text-muted">{label}</h2>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{value}</p>
      <p className={`mt-1 text-sm ${up ? 'text-good' : 'text-bad'}`}>
        {up ? 'Up' : 'Down'} {Math.abs(change).toFixed(1)}% {caption}
      </p>
    </section>
  );
}
