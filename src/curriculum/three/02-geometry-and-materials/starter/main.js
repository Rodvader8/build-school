import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.5, 8);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

// Lights, so the Standard materials have something to react to (lesson 3 explains these).
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(4, 6, 5);
scene.add(key);

// 1. Left (x = -3): a BoxGeometry(1.6, 1.6, 1.6) with a MeshStandardMaterial. Matte violet: color 0x8b5cf6, roughness 0.8, metalness 0.

// 2. Middle (x = 0): a SphereGeometry(1, 48, 24) with a MeshStandardMaterial. Shiny cyan metal: color 0x22d3ee, metalness 1, roughness 0.2.

// 3. Right (x = 3): a TorusKnotGeometry(0.8, 0.25, 128, 16) with a MeshBasicMaterial, color 0xffffff and wireframe: true.

// 4. A small second sphere at (0, 1.9, 0) that REUSES the sphere's geometry and material (don't make new ones).
//    Shrink it with mesh.scale.setScalar(0.5).

window.__app = { scene, camera, renderer };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    scene.rotation.y = Math.sin(time / 2000) * 0.3;
    renderer.render(scene, camera);
  });
}
