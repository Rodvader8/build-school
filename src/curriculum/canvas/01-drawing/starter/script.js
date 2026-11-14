const canvas = document.querySelector('.cv-scene');
const slider = document.querySelector('.cv-slider');
const ctx = canvas.getContext('2d');

let width = 0;      // the canvas's size on the page, in CSS pixels
let height = 0;
let progress = 0;   // 0 = before dawn, 1 = full morning

// Blend two hex colours. mix('#000000', '#ffffff', 0.5) gives '#808080'.
function mix(a, b, t) {
  const n = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const c = (i) => Math.round(n(a, i) + (n(b, i) - n(a, i)) * t).toString(16).padStart(2, '0');
  return `#${c(0)}${c(1)}${c(2)}`;
}

// 1. Make the canvas sharp. Set width and height from clientWidth and clientHeight,
//    multiplied by window.devicePixelRatio, then ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
//    so you can keep drawing in CSS pixels.
function resize() {
}

// 2. Draw the scene for a progress from 0 to 1. Order matters, back to front:
//    sky     a linear gradient from the top to the horizon (height * 0.62):
//            top colour mix('#0c1030', '#5090d2', progress), bottom mix('#282860', '#fadcaa', progress)
//    sun     a filled circle at x = width * 0.68, y = horizon + height * 0.08 - progress * height * 0.38,
//            radius height * 0.1, colour mix('#ff965a', '#fffce1', progress)
//    sea     a rectangle from the horizon to the bottom, colour mix('#141e46', '#3c8cb0', progress)
//    land    a dark headland (colour '#16182a'): a path from (0, height) up to (0, height * 0.46),
//            across to (width * 0.5, height * 0.62), and down to (width * 0.4, height), then fill it.
function draw() {
}

// 3. Moving the slider sets progress (the slider goes 0 to 100) and redraws.
// 4. When the window is resized, run resize() and draw() again.

resize();
draw();
