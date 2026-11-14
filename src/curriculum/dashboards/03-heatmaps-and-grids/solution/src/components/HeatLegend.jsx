import { HEAT_CLASSES } from '../heat.js';

// The key. It says which end is "more", in words, so the colours aren't a secret code.
export default function HeatLegend({ lowLabel = 'Quieter', highLabel = 'Busier' }) {
  return (
    <div role="group" aria-label={`Colour scale: ${lowLabel} to ${highLabel}`} className="mt-3 flex items-center gap-2 text-xs text-muted">
      <span>{lowLabel}</span>
      {HEAT_CLASSES.map((cls) => (
        <span key={cls} aria-hidden="true" data-swatch className={`h-3 w-6 rounded-sm ${cls}`} />
      ))}
      <span>{highLabel}</span>
    </div>
  );
}
