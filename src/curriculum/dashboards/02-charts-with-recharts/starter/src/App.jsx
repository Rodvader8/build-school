import RevenueChart from './components/RevenueChart.jsx';
import LabourChart from './components/LabourChart.jsx';
import { months } from './data.js';

export default function App() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Harbour Street, last 12 months</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RevenueChart data={months} />
        <LabourChart data={months} />
      </div>
    </main>
  );
}
