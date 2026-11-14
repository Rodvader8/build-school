import type { LessonMeta } from '../../types';
import { errors, meshesIn, respectsReducedMotion, threeApp, threeModule, waitFor } from '../../helpers';

// The first check waits for the download; the rest only need a moment, so a missing model fails fast.
const ready = (win: Window, ms = 300) => waitFor(() => !!threeApp(win)?.model?.getObjectByName?.('Gem'), ms);

export default {
  title: 'Loading GLTF models',
  minutes: 35,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'The model loads and the "Gem" and "Plinth" nodes are in the scene', test: async ({ win }) => (await ready(win, 5000)) && !!threeApp(win).model.getObjectByName('Plinth') && !!threeApp(win).scene.getObjectById(threeApp(win).model.id) },
    { label: 'The file\'s own material comes through (the gem is "Crystal")', test: async ({ win }) => (await ready(win)) && threeApp(win).model.getObjectByName('Gem').material?.name === 'Crystal' },
    {
      label: 'The model is scaled so its biggest side is about 3 units',
      test: async ({ win }) => {
        if (!(await ready(win))) return false;
        const T = await threeModule(win);
        const size = new T.Box3().setFromObject(threeApp(win).model).getSize(new T.Vector3());
        const longest = Math.max(size.x, size.y, size.z);
        return longest > 2.7 && longest < 3.3;
      },
    },
    {
      label: 'It\'s centred on the origin',
      test: async ({ win }) => {
        if (!(await ready(win))) return false;
        const T = await threeModule(win);
        const c = new T.Box3().setFromObject(threeApp(win).model).getCenter(new T.Vector3());
        return Math.abs(c.x) < 0.15 && Math.abs(c.y) < 0.15 && Math.abs(c.z) < 0.15;
      },
    },
    { label: 'Every mesh in the model casts and receives shadows', test: async ({ win }) => (await ready(win)) && meshesIn(threeApp(win).model).length >= 2 && meshesIn(threeApp(win).model).every((m) => m.castShadow && m.receiveShadow) },
    {
      label: 'window.__app.gem is the Gem node, and update(1) spins it 0.8 radians',
      test: async ({ win }) => {
        if (!(await ready(win))) return false;
        const a = threeApp(win);
        if (a.gem !== a.model.getObjectByName('Gem')) return false;
        const y = a.gem.rotation.y;
        a.update(1);
        return Math.abs(a.gem.rotation.y - y - 0.8) < 0.01;
      },
    },
    { label: 'A failed load is handled (an error callback that warns)', test: ({ files }) => /undefined\s*,\s*\(?\s*\w*\s*\)?\s*=>[^;]*console\.(warn|error)|onError/.test(files['main.js'] ?? '') },
    { label: 'It redraws when the model arrives, and checks prefers-reduced-motion', test: ({ files }) => /GLTFLoader\(\)\s*\.load\([\s\S]*renderer\.render/.test(files['main.js'] ?? '') && respectsReducedMotion(files, 'main.js') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'GLTFLoader.load(url, onLoad, onProgress, onError). Pass undefined for the progress callback if you don\'t need one. gltf.scene is a Group holding everything in the file.',
    'Scale first, then measure again before centring: box.setFromObject(model) after model.scale.setScalar(...). Centre with model.position.sub(box.getCenter(new THREE.Vector3())).',
    'model.traverse(fn) visits every object inside, including nested ones. Only meshes have castShadow, so test o.isMesh first.',
  ],
} satisfies LessonMeta;
