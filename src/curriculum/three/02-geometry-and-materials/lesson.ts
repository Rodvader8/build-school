import type { LessonMeta } from '../../types';
import { errors, inView, meshesIn, respectsReducedMotion, threeApp } from '../../helpers';

const mats = (win: Window) => meshesIn(threeApp(win)?.scene).map((m) => m.material);
const geoTypes = (win: Window) => new Set(meshesIn(threeApp(win)?.scene).map((m) => m.geometry.type));

export default {
  title: 'Geometry and materials',
  minutes: 30,
  kind: 'web',
  entry: 'main.js',
  checks: [
    { label: 'There are at least four meshes in the scene', test: ({ win }) => meshesIn(threeApp(win)?.scene).length >= 4 },
    { label: 'Box, sphere and torus knot geometries are all used', test: ({ win }) => ['BoxGeometry', 'SphereGeometry', 'TorusKnotGeometry'].every((t) => geoTypes(win).has(t)) },
    { label: 'A matte MeshStandardMaterial (roughness 0.7 or more, no metal)', test: ({ win }) => mats(win).some((m) => m.isMeshStandardMaterial && m.roughness >= 0.7 && m.metalness <= 0.1) },
    { label: 'A shiny metal MeshStandardMaterial (metalness 0.8 or more, roughness 0.4 or less)', test: ({ win }) => mats(win).some((m) => m.isMeshStandardMaterial && m.metalness >= 0.8 && m.roughness <= 0.4) },
    { label: 'A MeshBasicMaterial with wireframe on', test: ({ win }) => mats(win).some((m) => m.isMeshBasicMaterial && m.wireframe === true) },
    { label: 'Two meshes share one geometry and one material', test: ({ win }) => { const ms = meshesIn(threeApp(win)?.scene); return ms.some((a) => ms.some((b) => a !== b && a.geometry === b.geometry && a.material === b.material)); } },
    { label: 'The shapes are spread out and all in view', test: ({ win }) => { const a = threeApp(win); const ms = meshesIn(a?.scene); const [m0, m1, m2] = ['BoxGeometry', 'SphereGeometry', 'TorusKnotGeometry'].map((t) => ms.find((m) => m.geometry.type === t)); return !!m0 && !!m1 && !!m2 && [m0, m1, m2].every((m) => inView(a, m)) && m0.position.distanceTo(m1.position) > 2 && m1.position.distanceTo(m2.position) > 2; } },
    { label: 'It checks prefers-reduced-motion before looping', test: ({ files }) => respectsReducedMotion(files, 'main.js') },
    { label: 'No errors', test: ({ win }) => errors(win).length === 0 },
  ],
  hints: [
    'A mesh needs two things: new THREE.Mesh(geometry, material). Set where it sits with mesh.position.x = -3 (or .position.set(x, y, z)).',
    'MeshStandardMaterial takes an options object: new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 1, roughness: 0.2 }).',
    'To share, store the geometry and material in consts first, then pass the same consts to two meshes. Neither one is copied.',
  ],
} satisfies LessonMeta;
