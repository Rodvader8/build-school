// What shows when you hover or focus a point. Classes instead of Recharts' style props, so it matches the theme.
export default function ChartTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-ink px-3 py-2 text-sm text-cream">
      <p className="text-muted">{label}</p>
      <p className="font-semibold tabular-nums">{format(payload[0].value)}</p>
    </div>
  );
}
