import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartFigure from './ChartFigure.jsx';
import ChartTooltip from './ChartTooltip.jsx';
import { describeSeries } from '../chartData.js';
import { formatPercent } from '../format.js';
import { labourTarget } from '../data.js';

const percent = (v) => formatPercent(v);
const columns = [
  { key: 'month', label: 'Month' },
  { key: 'labour', label: 'Labour %', format: percent },
];

// A line shows a trend, so it doesn't have to start at zero. A dashed reference line marks the target.
export default function LabourChart({ data }) {
  return (
    <ChartFigure title="Labour cost by month" summary={describeSeries(data, 'labour', 'Labour cost as a percentage of revenue', percent)} columns={columns} rows={data}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="var(--color-line)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
          <YAxis domain={[24, 36]} tickFormatter={(v) => `${v}%`} tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={48} />
          <Tooltip content={<ChartTooltip format={percent} />} />
          <ReferenceLine y={labourTarget} stroke="var(--color-good)" strokeDasharray="6 4" label={{ value: `Target ${labourTarget}%`, fill: 'var(--color-good)', position: 'insideTopRight' }} />
          <Line type="monotone" dataKey="labour" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFigure>
  );
}
