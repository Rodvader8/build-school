import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.5, 8);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(4, 6, 5);
scene.add(key);

const matte = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.6, 1.6),
  new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.8, metalness: 0 }),
);
matte.position.x = -3;

const sphereGeometry = new THREE.SphereGeometry(1, 48, 24);
const metal = new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 1, roughness: 0.2 });
const shiny = new THREE.Mesh(sphereGeometry, metal);

const wire = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.25, 128, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
);
wire.position.x = 3;

// Same geometry and material as `shiny`: one copy in memory, two objects on screen.
const small = new THREE.Mesh(sphereGeometry, metal);
small.scale.setScalar(0.5);
small.position.y = 1.9;

scene.add(matte, shiny, wire, small);

window.__app = { scene, camera, renderer };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    scene.rotation.y = Math.sin(time / 2000) * 0.3;
    renderer.render(scene, camera);
  });
}
