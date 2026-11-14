import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.5, 8);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.2));
const key = new THREE.DirectionalLight(0xffffff, 3);
key.position.set(3, 5, 4);
scene.add(key);

// Three boxes you can point at. Each has its own material, so one can glow without the others.
const boxes = [-2.5, 0, 2.5].map((x) => {
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 }));
  box.position.x = x;
  scene.add(box);
  return box;
});

// hovered and selected are the state the pointer handlers change. Checks read them through __app.
const app = { scene, camera, renderer, boxes, hovered: null, selected: null };
window.__app = app;

const draw = () => renderer.render(scene, camera);

// The selected box grows to 1.25 times its size. Calm mode skips the easing and jumps straight there.
function update(delta) {
  for (const box of boxes) {
    const target = box === app.selected ? 1.25 : 1;
    box.scale.setScalar(calm ? target : box.scale.x + (target - box.scale.x) * (1 - Math.exp(-12 * delta)));
  }
}
app.update = update;

// With a loop, state changes show up on the next frame. In calm mode there's no loop, so call sync().
function sync() {
  if (!calm) return;
  update(1);
  draw();
}

draw();
if (!calm) {
  const timer = new THREE.Timer();
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    draw();
  });
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function pick(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(boxes, false)[0]; // nearest first
  return hit ? hit.object : null;
}

// Only on pointer events, never once per frame: the ray is cheap, but it's free to skip.
canvas.addEventListener('pointermove', (event) => {
  app.hovered = pick(event);
  for (const box of boxes) box.material.emissive.setHex(box === app.hovered ? 0x22d3ee : 0x000000);
  canvas.classList.toggle('is-hover', !!app.hovered);
  sync();
});

canvas.addEventListener('click', (event) => {
  app.selected = pick(event);
  sync();
});
