import { useEffect, useState } from 'react';
import { periods, history } from '../data.js';
import { money } from '../format.js';

export default function NetWorth() {
  const [period, setPeriod] = useState('1Y');

  // Step 1: this copies a value into state with an effect. It works, but it renders twice
  // on every click. The change can be worked out while rendering, so no state and no effect.
  const [change, setChange] = useState({ diff: 0, percent: 0 });
  useEffect(() => {
    const { start, end } = history[period];
    setChange({ diff: end - start, percent: Math.round(((end - start) / start) * 100) });
  }, [period]);

  // Step 2: the browser tab should say "Net worth, 5Y | Kestrel". That one does need an effect,
  // because the title lives outside React.

  return (
    <section className="card">
      <h2>Net worth</h2>
      <p className="kpi-value">{money(history[period].end)}</p>
      <p className="kpi-change is-up">
        Up {money(change.diff)} ({change.percent}%) over {period}
      </p>
      <div className="toggle" role="group" aria-label="Period">
        {periods.map((p) => (
          <button key={p} type="button" aria-pressed={p === period} onClick={() => setPeriod(p)}>
            {p}
          </button>
        ))}
      </div>
    </section>
  );
}
