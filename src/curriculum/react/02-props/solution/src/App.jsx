import KpiCard from './components/KpiCard.jsx';

export default function App() {
  return (
    <div className="page">
      <h1>Overview</h1>
      <KpiCard label="Net worth" value={8080000} change={4.2} />
      <KpiCard label="Monthly spend" value={12400} change={-1.5} />
      <KpiCard label="Cash on hand" value={310000} />
      <KpiCard label="Savings" value={96500} change={0.8}>
        <p className="muted">Target: $120,000 by June</p>
      </KpiCard>
    </div>
  );
}
