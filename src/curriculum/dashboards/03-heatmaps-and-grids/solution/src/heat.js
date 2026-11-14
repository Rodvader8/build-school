// Full class names, written out, so Tailwind can see them and generate the CSS.
export const HEAT_CLASSES = ['bg-heat-0', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4'];
// Dark cells get light text and bright cells get dark text, so every number stays readable.
export const HEAT_TEXT = ['text-cream', 'text-cream', 'text-cream', 'text-ink', 'text-ink'];

/**
 * Which step of the scale a value falls in, from 0 (quietest) to steps - 1 (busiest).
 * The scale runs from 0 up to max, in equal slices. Zero, negative and empty data are always step 0.
 */
export function heatLevel(value, max, steps = 5) {
  if (!(value > 0) || !(max > 0)) return 0;
  return Math.min(steps - 1, Math.floor((value / max) * steps));
}
