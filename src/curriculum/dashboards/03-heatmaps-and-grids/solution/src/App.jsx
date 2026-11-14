import OccupancyHeatmap from './components/OccupancyHeatmap.jsx';
import LabourGrid from './components/LabourGrid.jsx';

export default function App() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">When are we busy?</h1>
      <OccupancyHeatmap />
      <LabourGrid />
    </main>
  );
}
