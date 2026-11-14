import type { LessonMeta } from '../../types';
import { errors, respectsReducedMotion, threeApp, wait, waitFor } from '../../helpers';

export default {
  title: 'The animation loop and resizing',
  minutes: 30,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'window.__app has the cube and an update(delta) function', test: ({ win }) => { const a = threeApp(win); return !!a?.cube && typeof a.update === 'function'; } },
    {
      label: 'update(1) turns the cube 0.6 radians, update(2) turns it twice as far',
      test: ({ win }) => {
        const a = threeApp(win);
        if (typeof a?.update !== 'function') return false;
        const y0 = a.cube.rotation.y;
        a.update(1);
        const y1 = a.cube.rotation.y;
        a.update(2);
        const y2 = a.cube.rotation.y;
        return Math.abs(y1 - y0 - 0.6) < 0.01 && Math.abs(y2 - y1 - 1.2) < 0.01;
      },
    },
    {
      label: 'The loop keeps drawing frames',
      test: async ({ win }) => {
        const r = threeApp(win)?.renderer;
        if (!r) return false;
        const before = r.info.render.frame;
        return waitFor(() => r.info.render.frame > before + 1, 4000);
      },
    },
    {
      label: 'The loop spins the cube by itself',
      test: async ({ win }) => {
        const a = threeApp(win);
        if (!a) return false;
        const y = a.cube.rotation.y;
        await wait(300);
        return a.cube.rotation.y !== y;
      },
    },
    {
      label: 'When the canvas shrinks, the aspect and the drawing size follow',
      test: async ({ win, doc }) => {
        const a = threeApp(win);
        const canvas = doc.querySelector('canvas')!;
        if (!a) return false;
        doc.body.style.width = '700px';
        win.dispatchEvent(new Event('resize'));
        await wait(50);
        const ok = Math.abs(a.camera.aspect - 700 / canvas.clientHeight) < 0.01 && canvas.clientWidth === 700 && canvas.width === Math.round(700 * a.renderer.getPixelRatio());
        doc.body.style.width = '';
        win.dispatchEvent(new Event('resize'));
        return ok;
      },
    },
    {
      label: 'When it grows back, everything follows again',
      test: async ({ win, doc }) => {
        const a = threeApp(win);
        const canvas = doc.querySelector('canvas')!;
        if (!a) return false;
        win.dispatchEvent(new Event('resize'));
        await wait(50);
        return Math.abs(a.camera.aspect - canvas.clientWidth / canvas.clientHeight) < 0.01 && canvas.width === Math.round(canvas.clientWidth * a.renderer.getPixelRatio());
      },
    },
    { label: 'Frame timing comes from THREE.Timer, with the delta clamped', test: ({ files }) => /new THREE\.Timer\(/.test(files['main.js'] ?? '') && /Math\.min\(/.test(files['main.js'] ?? '') },
    { label: 'It checks prefers-reduced-motion before looping', test: ({ files }) => respectsReducedMotion(files, 'main.js') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Movement per frame is "speed times delta": rotation.y += 0.6 * delta. Because delta shrinks when frames are faster, a 144 Hz and a 60 Hz screen spin at the same real speed.',
    'The loop callback receives the time in milliseconds. Pass it to the timer: timer.update(time); const delta = timer.getDelta().',
    'renderer.setSize(w, h, false) - that last false stops Three.js writing a fixed pixel size into the canvas\'s style, so your CSS stays in charge.',
  ],
} satisfies LessonMeta;
