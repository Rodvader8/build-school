import { useEffect, useState } from 'react';
import { periods, history } from '../data.js';
import { money } from '../format.js';

export default function NetWorth() {
  const [period, setPeriod] = useState('1Y');

  const { start, end } = history[period];
  const diff = end - start;
  const percent = Math.round((diff / start) * 100);

  useEffect(() => {
    document.title = `Net worth, ${period} | Kestrel`;
  }, [period]);

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
    </section>
  );
}
