import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartFigure from './ChartFigure.jsx';
import ChartTooltip from './ChartTooltip.jsx';
import { describeSeries } from '../chartData.js';
import { formatMoney } from '../format.js';

const money = (v) => formatMoney(v);
const columns = [
  { key: 'month', label: 'Month' },
  { key: 'revenue', label: 'Revenue', format: money },
];

// Bars are for comparing amounts, so the scale must start at zero: a bar twice as tall means twice the money.
export default function RevenueChart({ data }) {
  return (
    <ChartFigure title="Revenue by month" summary={describeSeries(data, 'revenue', 'Revenue by month', money)} columns={columns} rows={data}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="var(--color-line)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 'auto']} tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={56} />
          <Tooltip cursor={false} content={<ChartTooltip format={money} />} />
          <Bar dataKey="revenue" fill="var(--color-accent)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFigure>
  );
}
