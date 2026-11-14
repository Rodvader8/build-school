import { useState } from 'react';
import PeriodToggle from './components/PeriodToggle.jsx';
import KpiTile from './components/KpiTile.jsx';
import RevenueChart from './components/RevenueChart.jsx';
import CustomersTable from './components/CustomersTable.jsx';
import { business, customers, periods } from './data.js';
import { change, changePoints, formatMoney, formatMoneyExact, formatPercent } from './format.js';

const options = Object.entries(periods).map(([id, p]) => ({ id, label: p.label }));

export default function App() {
  const [period, setPeriod] = useState(business.defaultPeriod);
  const p = periods[period];
  const rows = customers.map((c) => ({ customer: c.customer, last: c.last, orders: c.orders[period], revenue: c.revenue[period] }));

  return (
    <>
      <a className="skip" href="#main">Skip to the dashboard</a>
      <header className="top">
        <h1>{business.name}</h1>
        <PeriodToggle options={options} value={period} onChange={setPeriod} />
      </header>
      <main id="main" className="page">
        <section aria-labelledby="kpis">
          <h2 id="kpis" className="sr-only">Key figures, {p.label.toLowerCase()}</h2>
          <div className="kpis">
            <KpiTile label="Revenue" value={formatMoney(p.revenue)} delta={change(p.revenue, p.previousRevenue)} />
            <KpiTile label="Orders" value={p.orders.toLocaleString('en-AU')} delta={change(p.orders, p.previousOrders)} />
            <KpiTile label="Average order" value={formatMoneyExact(p.avgOrder)} delta={change(p.avgOrder, p.previousAvgOrder)} />
            <KpiTile label="Repeat customers" value={formatPercent(p.repeatRate)} delta={changePoints(p.repeatRate, p.previousRepeatRate)} />
          </div>
        </section>
        <RevenueChart series={p.series} periodLabel={p.label} />
        <section className="panel" aria-labelledby="customers">
          <h2 id="customers" className="panel__title">Customers, {p.label.toLowerCase()}</h2>
          <CustomersTable rows={rows} />
        </section>
      </main>
    </>
  );
}
