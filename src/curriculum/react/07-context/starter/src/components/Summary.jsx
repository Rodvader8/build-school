import { usePeriod } from '../period-context.jsx';
import { weightedReturn } from '../data.js';

export default function Summary() {
  const { period } = usePeriod();
  return (
    <section className="card">
      <h2>Return over {period}</h2>
      <p className="kpi-value">{weightedReturn(period).toFixed(1)}%</p>
    </section>
  );
}
