import { periods, history } from '../data.js';
import { money } from '../format.js';

export default function NetWorth() {
  // Step 1: this should be state, so choosing a different period re-renders the card.
  const period = '1Y';

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
          <button key={p} type="button">
            {p}
          </button>
        ))}
      </div>

      {/* Step 3: a second piece of state, for a "How this is worked out" button
          and a paragraph that only appears after you press it. */}
    </section>
  );
}
