import { usePeriod } from '../period-context.jsx';
import { periods } from '../data.js';

export default function PeriodToggle() {
  const { period, setPeriod } = usePeriod();
  return (
    <div className="toggle" role="group" aria-label="Period">
      {periods.map((p) => (
        <button key={p} type="button" aria-pressed={p === period} onClick={() => setPeriod(p)}>
          {p}
        </button>
      ))}
    </div>
  );
}
