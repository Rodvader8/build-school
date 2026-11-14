import CashChart from './CashChart.jsx';
import { forecastCash } from '../forecast.js';
import { formatMoney } from '../format.js';
import { scenarioBase } from '../data.js';

// TODO: make this interactive.
//  - State: hireOn (starts false), salary (starts at hireDefaults.salary) and startMonth (hireDefaults.startMonth). Nothing else.
//  - A button with role="switch" and aria-checked={hireOn}, labelled "What if we hire?", that flips hireOn.
//  - When hireOn: show labelled number inputs "Monthly salary" (id salary) and "Starts in month" (id start).
//  - withHire is forecastCash({ ...scenarioBase, hire: { ...hireDefaults, salary, startMonth } }) when hireOn, otherwise null.
//  - Work out the lowest balance and the cash-out month from whichever series is showing (withHire ?? baseline).
//  - Show "Lowest balance" with the amount and "in month N", and a role="status" line: "Cash runs out in month N"
//    or "Cash stays positive for all 12 months".
export default function ScenarioPanel() {
  const baseline = forecastCash(scenarioBase);

  return (
    <section className="space-y-6">
      <p className="text-muted">Opening balance {formatMoney(scenarioBase.opening)}</p>
      <CashChart baseline={baseline} withHire={null} />
    </section>
  );
}
