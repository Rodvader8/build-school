gsap.registerPlugin(ScrollTrigger);

const TOTAL = 48;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const sequence = Array.from({ length: TOTAL }, (_, i) => {
  const img = new Image();
  img.src = `frames/frame-${String(i).padStart(2, '0')}.jpg`;
  return img;
});

// Draws frame number i (a whole number), if that image has arrived.
function drawFrame(i) {
  const img = sequence[i];
  if (img && img.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, width, height);
}

// Where the scroll bar wants the sequence to be: a DECIMAL frame number, 0 to 47.
let target = 0;

resize();

// 1. The spring's settings, and its state.
const STIFFNESS = 90;
const DAMPING = 2 * Math.sqrt(STIFFNESS);   // exactly enough to settle without wobbling
const spring = { x: 0, v: 0 };

// 2. One tiny step of physics.
function springStep(s, to, dt) {
  const force = STIFFNESS * (to - s.x) - DAMPING * s.v;
  s.v += force * dt;
  s.x += s.v * dt;
  return s;
}

// 3. A position like 12.4 is 60% frame 12 with 40% of frame 13 laid over it.
function drawBlend(position) {
  const a = Math.floor(position);
  const b = Math.min(a + 1, TOTAL - 1);
  ctx.globalAlpha = 1;
  drawFrame(a);
  ctx.globalAlpha = position - a;
  drawFrame(b);
  ctx.globalAlpha = 1;
}

if (calm) {
  sequence[TOTAL - 1].addEventListener('load', () => drawFrame(TOTAL - 1));
  drawFrame(TOTAL - 1);
} else {
  ScrollTrigger.create({
    trigger: '.cv-hero',
    start: 'top top',
    end: '+=300%',
    pin: true,
    onUpdate: (self) => { target = self.progress * (TOTAL - 1); },
  });

  // 4. Every tick, chase the target, then draw.
  gsap.ticker.add((time, deltaTime) => {
    springStep(spring, target, Math.min(deltaTime / 1000, 0.05));
    drawBlend(Math.max(0, Math.min(spring.x, TOTAL - 1)));
  });
}
