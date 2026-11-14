import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshNormalMaterial());
cube.rotation.set(0.5, 0.7, 0);
scene.add(cube);

const speed = 0.6; // radians per second

function update(delta) {
  cube.rotation.y += speed * delta;
}

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera); // a still scene has no loop to redraw it
}
window.addEventListener('resize', resize);
resize();

const timer = new THREE.Timer();
function frame(time) {
  timer.update(time);
  update(Math.min(timer.getDelta(), 0.1));
  renderer.render(scene, camera);
}

window.__app = { scene, camera, renderer, cube, update, resize };

if (!calm) renderer.setAnimationLoop(frame);
