import { periods } from '../data.js';

export default function PeriodToggle({ period, onChange }) {
  return (
    <div className="flex gap-1" role="group" aria-label="Period">
      {periods.map((p) => (
        <button
          key={p}
          type="button"
          aria-pressed={p === period}
          onClick={() => onChange(p)}
          className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-ink motion-safe:transition-colors"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
