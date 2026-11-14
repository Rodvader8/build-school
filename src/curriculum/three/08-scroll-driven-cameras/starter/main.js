import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0d18);
scene.fog = new THREE.Fog(0x0f0d18, 8, 34);
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight, false);

// A corridor of pillars along the z axis, sharing one geometry and one material.
scene.add(new THREE.HemisphereLight(0xb8c4ff, 0x1a1530, 1.4));
const key = new THREE.DirectionalLight(0x22d3ee, 2.2);
key.position.set(2, 6, 4);
scene.add(key);
const pillarGeometry = new THREE.BoxGeometry(0.8, 4, 0.8);
const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 });
for (let i = 0; i < 10; i++) {
  for (const x of [-4, 4]) {
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.position.set(x, 2, 8 - i * 4);
    scene.add(pillar);
  }
}
const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 60), new THREE.MeshStandardMaterial({ color: 0x1d1a30, roughness: 0.8 }));
floor.rotation.x = -Math.PI / 2;
floor.position.z = -12;
scene.add(floor);

const draw = () => renderer.render(scene, camera);

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  draw();
}
addEventListener('resize', resize);

const LOOK_AT = new THREE.Vector3(0, 1, -20); // the camera always faces this point, far down the corridor

// 1. scrollProgress(): how far down the page you are, from 0 to 1.
//    scrollY / (document.documentElement.scrollHeight - innerHeight), clamped, and 0 if the page can't scroll.

// 2. path: a THREE.CatmullRomCurve3 through these four points (x, y, z):
//    (0, 2, 12), (3, 1.5, 2), (-3, 1.5, -6), (0, 1.5, -14)

// 3. let target = 0 (where the scroll says to be) and let smoothed = 0 (where the camera actually is).
//    place(t): put the camera at path.getPointAt(t) and make it lookAt(LOOK_AT).
//    update(delta): ease smoothed towards target with 1 - Math.exp(-6 * delta) (so the speed doesn't depend on the
//    frame rate), then place(smoothed).

// 4. Calm mode: place(1) once and draw, with no scroll listener and no loop (a still, composed final view).
//    Otherwise: a passive 'scroll' listener that sets target = scrollProgress(), call it once now, and a loop that calls update.

function update(delta) {
  // fill me in
}

window.__app = { scene, camera, renderer, update };
draw();
