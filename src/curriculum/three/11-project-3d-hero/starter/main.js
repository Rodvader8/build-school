const hero = document.querySelector('.hero');
const canvas = hero.querySelector('.hero__canvas');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// The scene itself is written for you. It takes the THREE module as an argument, because you will load it late.
function buildScene(THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 50);
  camera.position.set(0, 0.4, 7);
  scene.add(new THREE.HemisphereLight(0xb8c4ff, 0x1a1530, 1.2));
  const key = new THREE.DirectionalLight(0x22d3ee, 3);
  key.position.set(3, 4, 5);
  scene.add(key);
  const crystal = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 0),
    new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.2, flatShading: true }),
  );
  crystal.position.x = 2;
  crystal.rotation.set(0.4, 0.6, 0);
  scene.add(crystal);
  return { scene, camera, crystal };
}

// 1. Decide the mode. 'three' only when calm is false AND the browser can make a WebGL2 context
//    (document.createElement('canvas').getContext('webgl2'), in a try/catch). Otherwise 'static'.
//    Save it as window.__heroMode and add the class is-3d or is-static to the hero.
//    In 'static' mode do nothing else: the poster image IS the hero. Don't even download Three.js.

// 2. startThree(): an async function that loads Three with a dynamic import:  const THREE = await import('three');
//    Then buildScene(THREE), a WebGLRenderer on the canvas (alpha: true), and:
//    - layout(): size from canvas.clientWidth/clientHeight, camera aspect + updateProjectionMatrix, and a pixel ratio
//      capped at 1.75 (Math.min(devicePixelRatio, 1.75)). Call it now and on 'resize'.
//    - state: progress/targetProgress (0..1, how far through the hero the page has scrolled, scrollY / hero.offsetHeight)
//      and mx/tx, my/ty (pointer from -1 to 1 across the window).
//    - update(delta): ease each state towards its target with 1 - Math.exp(-5 * delta); then
//      camera.position.set(mx * 0.6, 0.4 + my * 0.3, 7 - progress * 2.8); camera.lookAt(0, 0, 0); crystal.rotation.y += 0.25 * delta.
//    - listeners: passive 'scroll' sets targetProgress; 'pointermove' sets tx and ty.
//    - the loop only runs while the hero is on screen (IntersectionObserver) AND the tab is visible (visibilitychange).
//    - destroy(): stop the loop, dispose the geometry and material, renderer.dispose(). Run it on 'pagehide'.
//    - after the first frame: canvas.hidden = false and hero.classList.add('is-live') so the poster fades out.
//    - window.__app = { scene, camera, renderer, crystal, update, resize: layout, destroy }

// 3. Start it late, so the headline and poster paint first: requestIdleCallback with a { timeout }, AND a setTimeout
//    fallback (idle callbacks can sit waiting in a background tab). Make sure it can only start once.
