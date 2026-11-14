import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartFigure from './ChartFigure.jsx';
import ChartTooltip from './ChartTooltip.jsx';
import { formatMoney } from '../format.js';
import { lowestBalance } from '../forecast.js';

const money = (v) => formatMoney(v);

// Draws the baseline, and the "with hire" line too when there is one. Both come from the same maths, so the picture can't disagree with the numbers.
export default function CashChart({ baseline, withHire }) {
  const data = baseline.map((row, i) => ({ month: row.month, baseline: row.balance, ...(withHire ? { withHire: withHire[i].balance } : {}) }));
  const shown = withHire ?? baseline;
  const low = lowestBalance(shown);
  const columns = [
    { key: 'month', label: 'Month' },
    { key: 'baseline', label: 'Without a hire', format: money },
    ...(withHire ? [{ key: 'withHire', label: 'With the hire', format: money }] : []),
  ];

  return (
    <ChartFigure title="Cash balance by month" summary={`Cash balance by month. Lowest balance ${money(low.balance)} in month ${low.month}.`} columns={columns} rows={data}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="var(--color-line)" />
          <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={56} />
          <Tooltip content={<ChartTooltip format={money} />} />
          <ReferenceLine y={0} stroke="var(--color-bad)" />
          <Line type="monotone" dataKey="baseline" stroke="var(--color-muted)" strokeDasharray="5 4" dot={false} isAnimationActive={false} />
          {withHire && <Line type="monotone" dataKey="withHire" stroke="var(--color-accent)" strokeWidth={2} dot={false} isAnimationActive={false} />}
        </LineChart>
      </ResponsiveContainer>
    </ChartFigure>
  );
}
