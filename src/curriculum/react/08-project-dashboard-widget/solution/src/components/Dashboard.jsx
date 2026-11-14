import { useEffect, useState } from 'react';
import { entities, periods, totalValue, weightedReturn } from '../data.js';
import { money } from '../format.js';
import KpiCard from './KpiCard.jsx';
import PeriodToggle from './PeriodToggle.jsx';
import EntityTable from './EntityTable.jsx';

const STORAGE_KEY = 'dashboard-period';

function loadPeriod() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return periods.includes(saved) ? saved : '1Y';
  } catch {
    return '1Y';
  }
}

export default function Dashboard() {
  const [period, setPeriod] = useState(loadPeriod);
  const [sort, setSort] = useState({ key: null, dir: 'ascending' });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, period);
    } catch {
      /* storage can be blocked: the toggle still works */
    }
  }, [period]);

  const valueOf = (entity) => (sort.key === 'return' ? entity.returns[period] : entity[sort.key]);
  const rows = sort.key
    ? [...entities].sort((a, b) => {
        const x = valueOf(a);
        const y = valueOf(b);
        const result = typeof x === 'number' ? x - y : x.localeCompare(y);
        return sort.dir === 'ascending' ? result : -result;
      })
    : entities;

  function handleSort(key) {
    setSort((current) => ({ key, dir: current.key === key && current.dir === 'ascending' ? 'descending' : 'ascending' }));
  }

  return (
    <div className="flex flex-col gap-6">
      <PeriodToggle period={period} onChange={setPeriod} />
      <KpiCard label="Total value" value={money(totalValue())} change={weightedReturn(period)} caption={`over ${period}`} />
      <EntityTable rows={rows} period={period} sort={sort} onSort={handleSort} />
    </div>
  );
}
