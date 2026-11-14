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

// 1. The spring's settings, and its state (x is where it is, v is how fast it's moving):
//      const STIFFNESS = 90;
//      const DAMPING = 2 * Math.sqrt(STIFFNESS);   // exactly enough to settle without wobbling
//      const spring = { x: 0, v: 0 };
//
// 2. springStep(s, to, dt): one tiny step of physics, changing s.x and s.v, and returning s.
//      force = STIFFNESS * (to - s.x) - DAMPING * s.v
//      s.v += force * dt;   s.x += s.v * dt;
//
// 3. drawBlend(position): position is a decimal like 12.4.
//      Draw frame floor(position) normally, then draw the NEXT frame on top with
//      ctx.globalAlpha set to the leftover decimal (0.4), then put globalAlpha back to 1.
//      The next frame must never go past TOTAL - 1.

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

  // 4. Every tick (gsap.ticker.add gives you the time since the last tick in milliseconds):
  //      step the spring toward target with dt in seconds (cap it at 0.05 so a lag spike can't fling it),
  //      then drawBlend(spring.x).
}
