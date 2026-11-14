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

const LOOK_AT = new THREE.Vector3(0, 1, -20);

function scrollProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
}

const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2, 12),
  new THREE.Vector3(3, 1.5, 2),
  new THREE.Vector3(-3, 1.5, -6),
  new THREE.Vector3(0, 1.5, -14),
]);

let target = 0;
let smoothed = 0;

function place(t) {
  camera.position.copy(path.getPointAt(t)); // getPointAt spaces points by distance, so the speed stays even
  camera.lookAt(LOOK_AT);
}

function update(delta) {
  smoothed += (target - smoothed) * (1 - Math.exp(-6 * delta));
  place(smoothed);
}

window.__app = { scene, camera, renderer, update };

if (calm) {
  place(1); // one composed arrival frame, no scroll hijack, no loop
  draw();
} else {
  const onScroll = () => { target = scrollProgress(); };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  update(10); // start exactly where the page already is, even after a reload mid-page
  const timer = new THREE.Timer();
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    draw();
  });
}
