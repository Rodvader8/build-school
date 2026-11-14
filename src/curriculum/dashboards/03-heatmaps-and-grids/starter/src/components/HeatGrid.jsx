import { HEAT_CLASSES, HEAT_TEXT, heatLevel } from '../heat.js';
import HeatLegend from './HeatLegend.jsx';

// TODO: a heat grid is a real table with shaded cells.
// Props: title, rowLabels, colLabels, values (values[row][col]), formatValue(v), describe(rowLabel, colLabel, v), lowLabel, highLabel.
//  - <table> with <caption>{title}</caption>
//  - a header row: an empty corner <td />, then <th scope="col"> for each column label
//  - a body row per row label: <th scope="row"> then one <td> per column
//  - each <td> shows formatValue(value) as text, has data-level={level}, aria-label={describe(...)}, and the classes
//    HEAT_CLASSES[level] and HEAT_TEXT[level] (the level comes from heatLevel(value, max), where max is the biggest value in the grid)
//  - <HeatLegend lowLabel={lowLabel} highLabel={highLabel} /> under the table
export default function HeatGrid(props) {
  return null;
}
