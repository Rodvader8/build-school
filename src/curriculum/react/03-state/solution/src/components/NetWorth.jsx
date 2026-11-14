import { useState } from 'react';
import { periods, history } from '../data.js';
import { money } from '../format.js';

export default function NetWorth() {
  const [period, setPeriod] = useState('1Y');
  const [showNote, setShowNote] = useState(false);

  const { start, end } = history[period];
  const diff = end - start;
  const percent = Math.round((diff / start) * 100);

  return (
    <section className="card">
      <h2>Net worth</h2>
      <p className="kpi-value">{money(end)}</p>
      <p className="kpi-change is-up">
        Up {money(diff)} ({percent}%) over {period}
      </p>

      <div className="toggle" role="group" aria-label="Period">
        {periods.map((p) => (
          <button key={p} type="button" aria-pressed={p === period} onClick={() => setPeriod(p)}>
            {p}
          </button>
        ))}
      </div>

      <p>
        <button type="button" className="btn" aria-expanded={showNote} onClick={() => setShowNote(!showNote)}>
          How this is worked out
        </button>
      </p>
      {showNote && <p className="muted">The change is measured from the value at the start of the period.</p>}
    </section>
  );
}
