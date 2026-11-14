import type { LessonMeta } from '../../types';
import { clientPointOf, errors, fire, respectsReducedMotion, threeApp, wait, waitFor } from '../../helpers';
import type { CheckContext } from '../../types';

const canvasOf = (c: CheckContext) => c.doc.querySelector('canvas')!;
const aimAt = (c: CheckContext, box: any) => clientPointOf(threeApp(c.win), canvasOf(c), box);
const corner = (c: CheckContext) => { const r = canvasOf(c).getBoundingClientRect(); return { clientX: r.left + 6, clientY: r.top + 6 }; };

export default {
  title: 'Pointer and raycasting',
  minutes: 35,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'Nothing is hovered or selected to begin with', test: ({ win }) => threeApp(win)?.hovered === null && threeApp(win)?.selected === null },
    {
      label: 'Moving the pointer over the middle box makes it the hovered one',
      test: async (c) => {
        const a = threeApp(c.win);
        if (!a) return false;
        fire(c, canvasOf(c), 'pointermove', aimAt(c, a.boxes[1]));
        return waitFor(() => a.hovered === a.boxes[1], 1000);
      },
    },
    {
      label: 'The hovered box glows (emissive) and the others don\'t',
      test: ({ win }) => { const a = threeApp(win); return !!a && a.boxes[1].material.emissive.getHex() !== 0 && a.boxes[0].material.emissive.getHex() === 0 && a.boxes[2].material.emissive.getHex() === 0; },
    },
    { label: 'The canvas gets the class is-hover while over a box', test: ({ doc }) => doc.querySelector('canvas')!.classList.contains('is-hover') },
    {
      label: 'Moving to empty space clears the hover, the glow and the class',
      test: async (c) => {
        const a = threeApp(c.win);
        if (!a) return false;
        fire(c, canvasOf(c), 'pointermove', corner(c));
        await wait(50);
        return a.hovered === null && a.boxes.every((b: any) => b.material.emissive.getHex() === 0) && !canvasOf(c).classList.contains('is-hover');
      },
    },
    {
      label: 'Clicking the right box selects it, and it grows to 1.25 times its size',
      test: async (c) => {
        const a = threeApp(c.win);
        if (!a) return false;
        fire(c, canvasOf(c), 'click', aimAt(c, a.boxes[2]));
        await wait(20);
        a.update?.(2);
        return a.selected === a.boxes[2] && Math.abs(a.boxes[2].scale.x - 1.25) < 0.02 && Math.abs(a.boxes[0].scale.x - 1) < 0.02;
      },
    },
    {
      label: 'Clicking empty space deselects',
      test: async (c) => {
        const a = threeApp(c.win);
        if (!a) return false;
        fire(c, canvasOf(c), 'click', corner(c));
        await wait(20);
        a.update?.(2);
        return a.selected === null && a.boxes.every((b: any) => Math.abs(b.scale.x - 1) < 0.02);
      },
    },
    { label: 'It uses a Raycaster with setFromCamera and the canvas\'s own bounding rect', test: ({ files }) => /new THREE\.Raycaster\(/.test(files['main.js'] ?? '') && /setFromCamera\(/.test(files['main.js'] ?? '') && /getBoundingClientRect\(/.test(files['main.js'] ?? '') },
    { label: 'It checks prefers-reduced-motion', test: ({ files }) => respectsReducedMotion(files, 'main.js') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Normalised device coordinates run from -1 to 1 across the canvas, with y pointing UP (the opposite of the page). x = (clientX - rect.left) / rect.width * 2 - 1, and y = -((clientY - rect.top) / rect.height) * 2 + 1.',
    'raycaster.intersectObjects(boxes) returns an array of hits, nearest first. Each hit has .object (the mesh), .point and .distance. An empty array means the ray hit nothing.',
    'Use the canvas\'s rect, not the window\'s size. The moment your canvas isn\'t the full page, window-based maths is off, and clicks land in the wrong place.',
  ],
} satisfies LessonMeta;
