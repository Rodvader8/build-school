gsap.registerPlugin(ScrollTrigger);

const TOTAL = 48;
const GAP = 14;                                   // space between the copy and the scene, in px
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const hero = document.querySelector('[data-hero]');
const inner = document.querySelector('.cv-hero__inner');
const copy = document.querySelector('[data-hero-copy]');
const canvas = document.querySelector('.cv-scene');
const ctx = canvas.getContext('2d');

let shownFrame = 0;   // the frame on the canvas (the checks read this)

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ---------- Frames: polite loading, from lesson 2. Already done for you. ---------- */
const sequence = new Array(TOTAL).fill(null);

function loadFrame(i) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `frames/frame-${String(i).padStart(2, '0')}.jpg`;
    sequence[i] = img;
  });
}

function drawFrame(i) {
  const img = sequence[i];
  if (img && img.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
}

let started = false;
function loadRest() {
  if (started) return;
  started = true;
  for (let i = 1; i < TOTAL; i++) loadFrame(i);
}
const ENGAGE = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'keydown', 'scroll'];
function onEngage() {
  ENGAGE.forEach((name) => window.removeEventListener(name, onEngage));
  if (document.readyState === 'complete') loadRest();
  else window.addEventListener('load', loadRest, { once: true });
}
ENGAGE.forEach((name) => window.addEventListener(name, onEngage, { passive: true }));

/* ---------- Scrubbing: from lesson 3. Already done for you. ---------- */
// The hero is sticky, so CSS holds it still. ScrollTrigger only reads how far through the hero we are.
if (calm) {
  loadFrame(TOTAL - 1).then(() => { shownFrame = TOTAL - 1; resize(); drawFrame(shownFrame); });
} else {
  loadFrame(0).then(() => drawFrame(0));
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      shownFrame = Math.round(self.progress * (TOTAL - 1));
      drawFrame(shownFrame);
    },
  });
}

/* ---------- The phone ---------- */

// 2. Measure the copy, give the scene the room that's left, and set how far the scrub travels.
function layout() {
  const copyBottom = copy.getBoundingClientRect().bottom - inner.getBoundingClientRect().top;
  const room = window.innerHeight - copyBottom - GAP - 16;
  hero.style.setProperty('--scene-h', `${Math.max(120, Math.floor(room))}px`);
  hero.style.setProperty('--travel', `${Math.round(window.innerHeight * 0.75)}px`);
  resize();
  drawFrame(shownFrame);
  ScrollTrigger.refresh();
}

// 3. Once now, and again only when the WIDTH changes. Height changes are just the address bar.
let lastWidth = window.innerWidth;
layout();
window.addEventListener('resize', () => {
  if (window.innerWidth === lastWidth) return;
  lastWidth = window.innerWidth;
  layout();
});
