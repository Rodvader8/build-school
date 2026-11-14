import HeatGrid from './HeatGrid.jsx';
import { days, rooms, occupancy } from '../data.js';

export default function OccupancyHeatmap() {
  return (
    <HeatGrid
      title="Room occupancy by day"
      rowLabels={rooms}
      colLabels={days}
      values={occupancy}
      formatValue={(v) => `${v}%`}
      describe={(room, day, v) => `${room}, ${day}: ${v}% of seats booked`}
      lowLabel="Quieter"
      highLabel="Fuller"
    />
  );
}
