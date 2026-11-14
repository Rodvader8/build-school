const TOTAL = 48;
const framePath = (i) => `frames/frame-${String(i).padStart(2, '0')}.jpg`;

const canvas = document.querySelector('.cv-scene');
const ctx = canvas.getContext('2d');
let width = 0;
let height = 0;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawImage(img) {
  ctx.drawImage(img, 0, 0, width, height);
}

// The Image objects, by frame number. Slots are empty (null) until a frame has been asked for.
const sequence = new Array(TOTAL).fill(null);

resize();

// 1. One frame: make the Image, keep it, and tell me when it's ready.
function loadFrame(i) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = framePath(i);
    sequence[i] = img;
  });
}

// 2. At rest, only the opening frame.
loadFrame(0).then(drawImage);

// 3. The rest, once.
let started = false;
function loadRest() {
  if (started) return;
  started = true;
  for (let i = 1; i < TOTAL; i++) loadFrame(i);
}

// 4. Wait for a sign of life, then wait for the page's own load, then fetch.
const ENGAGE = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'keydown', 'scroll'];
function onEngage() {
  ENGAGE.forEach((name) => window.removeEventListener(name, onEngage));
  if (document.readyState === 'complete') loadRest();
  else window.addEventListener('load', loadRest, { once: true });
}
ENGAGE.forEach((name) => window.addEventListener(name, onEngage, { passive: true }));
