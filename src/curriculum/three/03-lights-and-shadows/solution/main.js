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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

scene.add(new THREE.HemisphereLight(0xb8c4ff, 0x2a2540, 0.6));

const key = new THREE.DirectionalLight(0xffffff, 3);
key.position.set(4, 7, 3);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 20 });
key.shadow.radius = 3;
scene.add(key);

ball.castShadow = true;
block.castShadow = true;
floor.receiveShadow = true;

window.__app = { scene, camera, renderer, floor, ball, block };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    ball.position.x = Math.sin(time / 1500) * 1.5;
    renderer.render(scene, camera);
  });
}
