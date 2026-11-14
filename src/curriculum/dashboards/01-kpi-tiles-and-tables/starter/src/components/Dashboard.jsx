import KpiTile from './KpiTile.jsx';
import DataTable from './DataTable.jsx';
import { venues } from '../data.js';
import { summarise } from '../metrics.js';
import { changePct, formatMoney, formatPercent } from '../format.js';

const columns = [
  { key: 'name', label: 'Venue' },
  { key: 'suburb', label: 'Suburb' },
  { key: 'revenue', label: 'Revenue', numeric: true, format: (v) => formatMoney(v) },
  { key: 'covers', label: 'Covers', numeric: true, format: (v) => v.toLocaleString('en-AU') },
  { key: 'labourPct', label: 'Labour %', numeric: true, format: (v) => formatPercent(v) },
];

export default function Dashboard() {
  const m = summarise();
  const rows = venues.map((v) => ({ ...v, labourPct: (v.labour / v.revenue) * 100 }));
  const totals = { revenue: m.revenue.now, covers: m.covers.now, labourPct: m.labourPct.now };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Harbourlight Group, this month</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Revenue" value={formatMoney(m.revenue.now)} change={changePct(m.revenue.now, m.revenue.before)} />
        <KpiTile label="Covers" value={m.covers.now.toLocaleString('en-AU')} change={changePct(m.covers.now, m.covers.before)} />
        <KpiTile label="Spend per cover" value={formatMoney(m.spend.now, 2)} change={changePct(m.spend.now, m.spend.before)} />
        <KpiTile label="Labour cost" value={formatPercent(m.labourPct.now)} change={changePct(m.labourPct.now, m.labourPct.before)} goodWhenUp={false} />
      </div>
      <h2 className="mb-3 mt-10 text-lg font-semibold">By venue</h2>
      <DataTable caption="Revenue, covers and labour percentage by venue" columns={columns} rows={rows} totals={totals} />
    </main>
  );
}
