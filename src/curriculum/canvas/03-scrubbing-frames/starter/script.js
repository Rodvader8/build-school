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

// 1. A tiny object to animate: const state = { frame: 0 };
//
// 2. render(): turn state.frame into a whole number with Math.round, store it in shownFrame,
//    and call drawFrame with it.
//
// 3. Reduced motion: set state.frame to the last frame, render once, and stop. No scrolling effect.
//
// 4. Otherwise: gsap.to(state, ...) that takes frame to TOTAL - 1, with
//      ease: 'none'                    (the scroll bar is the easing)
//      snap: 'frame'                   (only whole frame numbers)
//      onUpdate: render
//    and a scrollTrigger on '.cv-hero': start 'top top', end '+=300%', pin: true, scrub: true.
