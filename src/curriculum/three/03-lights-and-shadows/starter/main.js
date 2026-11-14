import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0d18);
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 3, 9);
camera.lookAt(0, 0.5, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0x2a2540, roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2; // planes stand up by default, so lay it flat
const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3 }));
ball.position.y = 1;
const block = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.5 }));
block.position.set(2.6, 0.7, -0.5);
scene.add(floor, ball, block);

// 1. Turn shadows on in the renderer: renderer.shadowMap.enabled = true, and use type THREE.PCFShadowMap.

// 2. A soft fill so the dark side isn't black: a THREE.HemisphereLight(0xb8c4ff, 0x2a2540, 0.6), added to the scene.

// 3. The key light: a DirectionalLight(0xffffff, 3) at (4, 7, 3), added to the scene, with castShadow = true.
//    Give its shadow a 2048 x 2048 map (light.shadow.mapSize.set) and a tight camera box:
//    light.shadow.camera left/bottom -6, right/top 6, near 1, far 20.

// 4. Decide who casts and who receives: the ball and the block castShadow, the floor receiveShadow.

window.__app = { scene, camera, renderer, floor, ball, block };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    ball.position.x = Math.sin(time / 1500) * 1.5;
    renderer.render(scene, camera);
  });
}
