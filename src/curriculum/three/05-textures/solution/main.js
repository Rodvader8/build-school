import * as THREE from 'three';

const canvas = document.querySelector('.t-canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 3.2, 6);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 1));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(-3, 5, 4);
scene.add(sun);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x806040 }));
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const loader = new THREE.TextureLoader();
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

function load(url, isColour = false) {
  const texture = loader.load(url, () => {
    if (calm) renderer.render(scene, camera); // no loop in calm mode, so draw once the image arrives
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.anisotropy = maxAnisotropy;
  if (isColour) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

floor.material.map = load('planks.png', true);
floor.material.roughnessMap = load('planks-rough.png');
floor.material.roughness = 1;
floor.material.color.set(0xffffff); // colour multiplies the map, so white leaves it untouched

window.__app = { scene, camera, renderer, floor };

renderer.render(scene, camera);
if (!calm) {
  renderer.setAnimationLoop((time) => {
    sun.position.x = Math.sin(time / 3000) * 4;
    renderer.render(scene, camera);
  });
}
