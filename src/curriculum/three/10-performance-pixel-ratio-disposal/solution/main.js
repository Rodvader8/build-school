import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 4, 14);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.4));
const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(3, 6, 4);
scene.add(key);

const COUNT = 300;
// A tiny repeatable "random", so every rebuild makes the same arrangement.
const rand = (i, k) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function makeTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d');
  const gradient = g.createLinearGradient(0, 0, 16, 16);
  gradient.addColorStop(0, '#8b5cf6');
  gradient.addColorStop(1, '#22d3ee');
  g.fillStyle = gradient;
  g.fillRect(0, 0, 16, 16);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const draw = () => renderer.render(scene, camera);

// One geometry, one material, one texture, one draw call for all 300 cubes.
function build() {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ map: makeTexture() }), COUNT);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < COUNT; i++) {
    dummy.position.set((rand(i, 1) - 0.5) * 16, (rand(i, 2) - 0.5) * 8, (rand(i, 3) - 0.5) * 16);
    dummy.rotation.set(rand(i, 4) * 3, rand(i, 5) * 3, 0);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}
let group = build();
scene.add(group);

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // a 3x phone screen would draw 9 pixels for every 1 you can see
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  draw();
}
addEventListener('resize', resize);
resize();

// Removing something from the scene does NOT free its GPU memory. dispose() does.
function disposeTree(root) {
  root.traverse((object) => {
    object.geometry?.dispose();
    for (const material of [].concat(object.material ?? [])) {
      for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
      material.dispose();
    }
  });
}

function rebuild() {
  scene.remove(group);
  disposeTree(group);
  group = build();
  scene.add(group);
  draw();
}

function update(delta) {
  group.rotation.y += 0.1 * delta;
}

const timer = new THREE.Timer();
function frame(time) {
  timer.update(time);
  update(Math.min(timer.getDelta(), 0.1));
  draw();
}

// Run the loop only when somebody can see it: canvas on screen, tab visible, no reduced-motion request.
let onScreen = true;
let tabVisible = true;
let running = false;
function sync() {
  const next = onScreen && tabVisible && !calm;
  if (next === running) return; // guard, so loops never stack
  running = next;
  renderer.setAnimationLoop(next ? frame : null);
}
const observer = new IntersectionObserver(([entry]) => {
  onScreen = entry.isIntersecting;
  sync();
});
observer.observe(canvas);
document.addEventListener('visibilitychange', () => {
  tabVisible = !document.hidden;
  sync();
});

function destroy() {
  observer.disconnect();
  running = false;
  renderer.setAnimationLoop(null);
  disposeTree(scene);
  renderer.dispose();
}

window.__app = { scene, camera, renderer, resize, rebuild, destroy, update };

draw();
sync();
