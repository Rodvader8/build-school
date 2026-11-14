import { usePeriod } from '../period-context.jsx';
import { entities } from '../data.js';

export default function Breakdown() {
  const { period } = usePeriod();
  return (
    <section className="card">
      <h2>By entity</h2>
      <ul className="list">
        {entities.map((e) => (
          <li key={e.id}>
            <span>{e.name}</span>
            <span>{e.returns[period].toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
