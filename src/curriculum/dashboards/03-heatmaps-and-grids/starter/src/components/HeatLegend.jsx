import { HEAT_CLASSES } from '../heat.js';

// TODO: the key for the colours. Props: lowLabel (default "Quieter") and highLabel (default "Busier").
// Render a <div role="group" aria-label="Colour scale: Quieter to Busier"> holding the low label,
// five swatches (one <span aria-hidden="true" data-swatch> per class in HEAT_CLASSES, each with that class
// plus h-3 w-6 rounded-sm) and the high label.
export default function HeatLegend({ lowLabel = 'Quieter', highLabel = 'Busier' }) {
  return null;
}
