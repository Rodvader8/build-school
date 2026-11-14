import { useState } from 'react';
import CashChart from './CashChart.jsx';
import { forecastCash, lowestBalance, cashOutMonth } from '../forecast.js';
import { formatMoney } from '../format.js';
import { scenarioBase, hireDefaults } from '../data.js';

const input = 'mt-1 w-32 rounded-lg border border-line bg-ink px-3 py-2 tabular-nums';

export default function ScenarioPanel() {
  // Only what a person can change is state. The forecast, the lowest point and the warning are worked out each render.
  const [hireOn, setHireOn] = useState(false);
  const [salary, setSalary] = useState(hireDefaults.salary);
  const [startMonth, setStartMonth] = useState(hireDefaults.startMonth);

  const baseline = forecastCash(scenarioBase);
  const withHire = hireOn ? forecastCash({ ...scenarioBase, hire: { ...hireDefaults, salary, startMonth } }) : null;
  const shown = withHire ?? baseline;
  const low = lowestBalance(shown);
  const outMonth = cashOutMonth(shown);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end gap-6 rounded-2xl border border-line bg-surface p-5">
        <button
          type="button"
          role="switch"
          aria-checked={hireOn}
          onClick={() => setHireOn(!hireOn)}
          className="rounded-full border border-accent px-5 py-2 font-medium aria-checked:bg-accent aria-checked:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          What if we hire?
        </button>
        {hireOn && (
          <>
            <div>
              <label htmlFor="salary" className="block text-sm text-muted">
                Monthly salary
              </label>
              <input id="salary" type="number" min="0" step="500" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className={input} />
            </div>
            <div>
              <label htmlFor="start" className="block text-sm text-muted">
                Starts in month
              </label>
              <input id="start" type="number" min="1" max={scenarioBase.months} value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))} className={input} />
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-medium text-muted">Lowest balance</h2>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{formatMoney(low.balance)}</p>
          <p className="text-sm text-muted">in month {low.month}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-medium text-muted">Cash position</h2>
          <p role="status" className={`mt-2 text-xl font-semibold ${outMonth ? 'text-bad' : 'text-good'}`}>
            {outMonth ? `Cash runs out in month ${outMonth}` : `Cash stays positive for all ${scenarioBase.months} months`}
          </p>
        </div>
      </div>

      <CashChart baseline={baseline} withHire={withHire} />
    </section>
  );
}
