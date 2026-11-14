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

// THE PROBLEM. This works, but it asks for all 48 frames the instant the page opens.
// A visitor who never scrolls, and a speed test that never scrolls, pay for every one of them.
for (let i = 0; i < TOTAL; i++) {
  const img = new Image();
  img.src = framePath(i);
  sequence[i] = img;
}
sequence[0].onload = () => drawImage(sequence[0]);

// THE FIX, in four steps:
// 1. Write loadFrame(i). It makes an Image, saves it in sequence[i], and returns a Promise
//    that resolves with the image once it has loaded.
// 2. At rest, load ONLY frame 0, and draw it when it arrives.
// 3. Write loadRest(), which loads frames 1 to 47. It must only ever run once.
// 4. Don't call loadRest() on page load. Wait for the visitor's first sign of life, on window:
//    pointerdown, pointermove, touchstart, wheel, keydown or scroll. When one happens, stop
//    listening for the others, and then call loadRest() (after the page's own load event, if it
//    hasn't happened yet).
