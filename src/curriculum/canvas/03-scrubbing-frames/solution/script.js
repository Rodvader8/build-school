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

// All 48 frames, loaded up front to keep this lesson about scrolling. (Lesson 2 was the polite way.)
const sequence = Array.from({ length: TOTAL }, (_, i) => {
  const img = new Image();
  img.src = `frames/frame-${String(i).padStart(2, '0')}.jpg`;
  return img;
});

// Draws frame number i, if that image has arrived.
function drawFrame(i) {
  const img = sequence[i];
  if (img && img.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, width, height);
}

// The frame currently on the canvas. The lesson's checks read this, so keep it up to date.
let shownFrame = 0;

resize();
window.addEventListener('resize', () => { resize(); drawFrame(shownFrame); });
sequence[0].addEventListener('load', () => drawFrame(0));

// 1. A tiny object to animate.
const state = { frame: 0 };

// 2. Whole frame numbers only, and draw.
function render() {
  shownFrame = Math.round(state.frame);
  drawFrame(shownFrame);
}

if (calm) {
  // 3. Reduced motion: the finished picture, no scrubbing.
  state.frame = TOTAL - 1;
  sequence[TOTAL - 1].addEventListener('load', render);
  render();
} else {
  // 4. The scroll bar plays the sequence.
  gsap.to(state, {
    frame: TOTAL - 1,
    ease: 'none',
    snap: 'frame',
    onUpdate: render,
    scrollTrigger: { trigger: '.cv-hero', start: 'top top', end: '+=300%', pin: true, scrub: true },
  });
}
