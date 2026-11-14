import HeatGrid from './HeatGrid.jsx';
import { days, hours, staffing } from '../data.js';

export default function LabourGrid() {
  return (
    <HeatGrid
      title="Staff on the floor by time of day"
      rowLabels={hours}
      colLabels={days}
      values={staffing}
      formatValue={(v) => String(v)}
      describe={(hour, day, v) => `${day} at ${hour}: ${v} staff on the floor`}
      lowLabel="Fewer staff"
      highLabel="More staff"
    />
  );
}
