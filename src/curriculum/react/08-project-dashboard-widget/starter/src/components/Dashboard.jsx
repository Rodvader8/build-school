import { entities, totalValue, weightedReturn } from '../data.js';
import { money } from '../format.js';
import KpiCard from './KpiCard.jsx';
import PeriodToggle from './PeriodToggle.jsx';
import EntityTable from './EntityTable.jsx';

// This is the widget. Plan it as "state, then render":
//
//   State (what a click changes)        Worked out while rendering
//   - period: '1Y' | '5Y' | '10Y'       - the weighted return for the period
//   - sort: { key, dir }                - the rows, sorted a copy at a time
//
// Remember the period between visits in localStorage under "dashboard-period".
// Wrap storage in try/catch, and ignore a saved value that isn't one of the periods.
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted">Build the dashboard here: {money(totalValue())} across {entities.length} entities.</p>
      <KpiCard label="Total value" value={money(totalValue())} change={weightedReturn('1Y')} caption="over 1Y" />
    </div>
  );
}
