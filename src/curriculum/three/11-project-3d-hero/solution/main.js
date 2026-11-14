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

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

// Reduced motion or no WebGL: keep the poster image. No Three.js download at all.
const mode = !calm && hasWebGL() ? 'three' : 'static';
window.__heroMode = mode;
hero.classList.add(mode === 'three' ? 'is-3d' : 'is-static');

async function startThree() {
  const THREE = await import('three');
  const { scene, camera, crystal } = buildScene(THREE);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const draw = () => renderer.render(scene, camera);

  function layout() {
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    draw();
  }
  addEventListener('resize', layout);
  layout();

  let progress = 0, targetProgress = 0, mx = 0, tx = 0, my = 0, ty = 0;
  addEventListener('scroll', () => { targetProgress = Math.min(Math.max(scrollY / hero.offsetHeight, 0), 1); }, { passive: true });
  addEventListener('pointermove', (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = -((e.clientY / innerHeight) * 2 - 1); });

  function update(delta) {
    const k = 1 - Math.exp(-5 * delta);
    progress += (targetProgress - progress) * k;
    mx += (tx - mx) * k;
    my += (ty - my) * k;
    camera.position.set(mx * 0.6, 0.4 + my * 0.3, 7 - progress * 2.8);
    camera.lookAt(0, 0, 0);
    crystal.rotation.y += 0.25 * delta;
  }

  const timer = new THREE.Timer();
  const frame = (time) => {
    timer.update(time);
    update(Math.min(timer.getDelta(), 0.1));
    draw();
  };

  // One function decides whether the loop runs, so the inputs can't start two of them.
  let onScreen = true, tabVisible = true, running = false;
  function sync() {
    const next = onScreen && tabVisible;
    if (next === running) return;
    running = next;
    renderer.setAnimationLoop(next ? frame : null);
  }
  const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }, { rootMargin: '100px' });
  observer.observe(hero);
  document.addEventListener('visibilitychange', () => { tabVisible = !document.hidden; sync(); });

  function destroy() {
    observer.disconnect();
    running = false;
    renderer.setAnimationLoop(null);
    crystal.geometry.dispose();
    crystal.material.dispose();
    renderer.dispose();
  }
  addEventListener('pagehide', destroy);

  window.__app = { scene, camera, renderer, crystal, update, resize: layout, destroy };

  update(10); // start where the page already is
  draw();
  canvas.hidden = false;
  hero.classList.add('is-live');
  sync();
}

if (mode === 'three') {
  let started = false;
  const go = () => {
    if (started) return;
    started = true;
    startThree();
  };
  // Idle callbacks can wait forever in a background tab, so a timer is the safety net.
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 1500 });
  setTimeout(go, 2000);
}
