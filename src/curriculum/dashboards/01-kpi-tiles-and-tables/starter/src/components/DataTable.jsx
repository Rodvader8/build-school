// TODO: a table people can actually read.
// Props: caption (screen readers only: sr-only), columns ([{ key, label, numeric, format }]), rows ([{ id, ...values }])
// and totals (an optional { key: value } for a footer row).
// Needs: <caption>, <th scope="col"> headers, the first cell of each row as <th scope="row">, numeric columns
// right-aligned with tabular-nums so the digits line up, and a <tfoot> row labelled "Total" when totals is given.
export default function DataTable({ caption, columns, rows, totals }) {
  return null;
}
