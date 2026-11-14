// Build a sortable table. It gets:
//   rows     the entities, already sorted by the dashboard
//   period   '1Y' | '5Y' | '10Y', for the Return column (entity.returns[period])
//   sort     { key, dir } where dir is 'ascending' or 'descending'
//   onSort   call onSort('value') when a header button is pressed
//
// Needs: a <caption className="sr-only">Entities</caption>, four columns (Name, Type, Value, Return),
// each <th> with aria-sort and a real <button> inside, a key on every row, and a visible
// focus-visible style on the header buttons.
export default function EntityTable() {
  return null;
}
