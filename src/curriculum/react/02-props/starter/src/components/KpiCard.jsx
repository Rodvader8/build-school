// This card ignores everything it's given. Make it use its props:
//   label     the title
//   value     a number, shown as dollars with commas ($2,400,000)
//   change    an optional percentage: show "Up 4.2%" or "Down 1.5%" (no minus sign)
//   children  anything placed between <KpiCard> and </KpiCard>
export default function KpiCard(props) {
  return (
    <section className="card">
      <h2>Label</h2>
      <p className="kpi-value">$0</p>
    </section>
  );
}
