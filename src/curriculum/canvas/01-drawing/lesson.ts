import type { LessonMeta } from '../../types';
import { errors, fire, wait, waitFor } from '../../helpers';

const canvas = (doc: Document) => doc.querySelector('.cv-scene') as HTMLCanvasElement;
const slider = (doc: Document) => doc.querySelector('.cv-slider') as HTMLInputElement;
/** RGB of the pixel at a fraction of the canvas (0 to 1 across, 0 to 1 down). */
function pixel(doc: Document, fx: number, fy: number) {
  const c = canvas(doc);
  const d = c.getContext('2d')!.getImageData(Math.floor(fx * c.width), Math.floor(fy * c.height), 1, 1).data;
  return { r: d[0], g: d[1], b: d[2], a: d[3] };
}
const SUN = [0.68, 0.32] as const;

export default {
  title: 'Canvas 2D: drawing a sunrise',
  minutes: 30,
  kind: 'web',
  entry: 'script.js',
  checks: [
    {
      label: 'The canvas is sharp: its pixels match its size on screen times the device pixel ratio',
      test: ({ doc, win }) => { const c = canvas(doc); const dpr = win.devicePixelRatio || 1; return c.clientWidth > 0 && c.width === Math.round(c.clientWidth * dpr) && c.height === Math.round(c.clientHeight * dpr); },
    },
    {
      label: 'Before dawn the sun is hidden below the sea, and the sky is dark',
      test: ({ doc }) => { const p = pixel(doc, ...SUN); return p.a === 255 && p.r < 90 && p.g < 90 && p.b < 140; },
    },
    {
      label: 'Dragging the slider to the end lifts the sun into the sky (a bright pixel where it should be)',
      test: ({ doc, win }) => { slider(doc).value = '100'; fire({ doc, win } as never, slider(doc), 'input'); const p = pixel(doc, ...SUN); return p.r > 230 && p.g > 215 && p.b > 150; },
    },
    {
      label: 'The sky is a gradient: lighter and warmer toward the horizon',
      test: ({ doc }) => { const top = pixel(doc, 0.5, 0.02); const low = pixel(doc, 0.5, 0.58); return low.r + low.g + low.b > top.r + top.g + top.b + 60; },
    },
    {
      label: 'The sea is blue, and the headland is a dark shape on the left',
      test: ({ doc }) => { const sea = pixel(doc, 0.85, 0.9); const land = pixel(doc, 0.08, 0.9); return sea.b > sea.r + 30 && land.r < 50 && land.g < 50 && land.b < 70; },
    },
    {
      label: 'Resizing the window re-sizes the canvas and redraws it',
      test: async ({ doc, win }) => {
        const frame = win.frameElement as HTMLIFrameElement;
        frame.setAttribute('width', '800');
        await wait(300);
        const c = canvas(doc);
        const ok = await waitFor(() => c.width === Math.round(c.clientWidth * (win.devicePixelRatio || 1)) && c.clientWidth < 760, 3000);
        const p = pixel(doc, ...SUN);
        frame.setAttribute('width', '1200');
        await wait(300);
        return ok && p.r > 230 && p.g > 215;
      },
    },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'canvas.width = Math.round(width * dpr) sets the real pixel grid. canvas.clientWidth is how big it looks on the page. Both matter.',
    'ctx.setTransform(dpr, 0, 0, dpr, 0, 0) means you can keep thinking in CSS pixels, and the canvas does the scaling for you.',
    'A gradient is made once, then given to fillStyle: const g = ctx.createLinearGradient(0, 0, 0, horizon); g.addColorStop(0, colour); ctx.fillStyle = g;',
  ],
} satisfies LessonMeta;
