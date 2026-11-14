// TODO: a line chart of labour % by month, framed by ChartFigure like RevenueChart is. Read RevenueChart first.
//  - title "Labour cost by month", a summary from describeSeries (format with formatPercent), columns Month and Labour %
//  - LineChart with a CartesianGrid, XAxis (dataKey "month"), YAxis (domain [24, 36], ticks like "30%"), Tooltip
//    using ChartTooltip, and one <Line dataKey="labour" /> with isAnimationActive={false}
//  - a dashed <ReferenceLine y={labourTarget} /> labelled "Target 30%"
export default function LabourChart({ data }) {
  return null;
}
