import type { LessonMeta } from '../../types';
import { errors, inView, meshesIn, respectsReducedMotion, threeApp, waitFor } from '../../helpers';

export default {
  title: 'Scene, camera, renderer',
  minutes: 25,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'window.__app holds a Scene, a PerspectiveCamera and a WebGLRenderer', test: ({ win }) => { const a = threeApp(win); return !!a?.scene?.isScene && !!a?.camera?.isPerspectiveCamera && !!a?.renderer?.isWebGLRenderer; } },
    { label: 'The camera is pulled back from the middle (position.z above 2)', test: ({ win }) => (threeApp(win)?.camera?.position.z ?? 0) > 2 },
    { label: 'The camera\'s aspect matches the canvas', test: ({ win, doc }) => { const c = doc.querySelector('canvas')!; return Math.abs((threeApp(win)?.camera?.aspect ?? 0) - c.clientWidth / c.clientHeight) < 0.01; } },
    { label: 'The scene has a Mesh with a geometry and a material', test: ({ win }) => { const m = meshesIn(threeApp(win)?.scene)[0]; return !!m?.geometry && !!m?.material; } },
    { label: 'The mesh sits inside the camera\'s view', test: ({ win }) => { const a = threeApp(win); const m = meshesIn(a?.scene)[0]; return !!m && inView(a, m); } },
    { label: 'The renderer draws into the page\'s canvas, sized to match', test: ({ win, doc }) => { const c = doc.querySelector('canvas')!; const r = threeApp(win)?.renderer; return r?.domElement === c && c.width > 0 && c.width === c.clientWidth * r.getPixelRatio(); } },
    { label: 'At least one frame has been drawn', test: ({ win }) => waitFor(() => (threeApp(win)?.renderer?.info.render.frame ?? 0) >= 1, 4000) },
    { label: 'It checks prefers-reduced-motion before starting the loop', test: ({ files }) => respectsReducedMotion(files, 'main.js') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'Three things make a picture: new THREE.Scene(), a camera, and a renderer. The scene holds objects, the camera chooses the view, and renderer.render(scene, camera) draws it.',
    'Everything starts at (0, 0, 0), including the camera, so it sits inside the cube. Set camera.position.z = 5 to step back.',
    'Mesh = geometry + material: new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshNormalMaterial()). Don\'t forget scene.add(mesh).',
  ],
} satisfies LessonMeta;
