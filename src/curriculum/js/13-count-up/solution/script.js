// Lesson 13: numbers that count up when they scroll into view.

const stats = document.querySelectorAll('.db-stat');
const DURATION = 1200; // milliseconds

const format = (n) => Math.round(n).toLocaleString('en-AU');
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function countUp(el) {
  const target = Number(el.dataset.target);
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / DURATION, 1);
    el.textContent = format(target * easeOut(t));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced || !('IntersectionObserver' in window)) {
  for (const el of stats) el.textContent = format(Number(el.dataset.target));
} else {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target); // only once
      }
    }
  }, { threshold: 0.5 });

  for (const el of stats) observer.observe(el);
}
