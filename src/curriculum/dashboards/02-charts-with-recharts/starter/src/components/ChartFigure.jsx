// TODO: the accessible frame every chart goes in. Props: title, summary, columns, rows, children (the drawing).
//  - a <figure> named by its <figcaption> (aria-labelledby + useId from react)
//  - the drawing wrapped in <div role="img" aria-label={summary} className="mt-4 h-72">, so screen readers get the
//    sentence instead of a wall of SVG
//  - the same numbers as a real table inside <details><summary>View as a table</summary>...</details>:
//    a caption, <th scope="col"> headers from columns ([{ key, label, format }]) and one row per item in rows
export default function ChartFigure({ title, summary, columns, rows, children }) {
  return null;
}
