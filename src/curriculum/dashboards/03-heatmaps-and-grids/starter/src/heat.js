// Full class names, written out, so Tailwind can see them and generate the CSS.
export const HEAT_CLASSES = ['bg-heat-0', 'bg-heat-1', 'bg-heat-2', 'bg-heat-3', 'bg-heat-4'];
// Dark cells get light text and bright cells get dark text, so every number stays readable.
export const HEAT_TEXT = ['text-cream', 'text-cream', 'text-cream', 'text-ink', 'text-ink'];

/**
 * Which step of the scale a value falls in, from 0 (quietest) to steps - 1 (busiest).
 * The scale runs from 0 up to max, in equal slices: with 5 steps, 0 to 19.9% of max is step 0,
 * 20% to 39.9% is step 1, and so on. A value at or above max is the top step.
 * Zero, negative and empty data (max of 0) are always step 0.
 */
export function heatLevel(value, max, steps = 5) {
  // TODO
  return 0;
}
