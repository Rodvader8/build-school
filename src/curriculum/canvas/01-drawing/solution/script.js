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

// 1. Make the canvas sharp.
function resize() {
  const dpr = window.devicePixelRatio || 1;
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// 2. Draw the scene, back to front.
function draw() {
  const horizon = height * 0.62;

  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, mix('#0c1030', '#5090d2', progress));
  sky.addColorStop(1, mix('#282860', '#fadcaa', progress));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, horizon);

  ctx.fillStyle = mix('#ff965a', '#fffce1', progress);
  ctx.beginPath();
  ctx.arc(width * 0.68, horizon + height * 0.08 - progress * height * 0.38, height * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = mix('#141e46', '#3c8cb0', progress);
  ctx.fillRect(0, horizon, width, height - horizon);

  ctx.fillStyle = '#16182a';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.46);
  ctx.lineTo(width * 0.5, horizon);
  ctx.lineTo(width * 0.4, height);
  ctx.closePath();
  ctx.fill();
}

// 3. Moving the slider sets progress and redraws.
slider.addEventListener('input', () => {
  progress = Number(slider.value) / 100;
  draw();
});

// 4. When the window is resized, size the canvas again, then redraw.
window.addEventListener('resize', () => {
  resize();
  draw();
});

resize();
draw();
