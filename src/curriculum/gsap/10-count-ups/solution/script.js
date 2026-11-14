gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const format = (n) => Math.round(n).toLocaleString('en-AU');   // 1284 becomes "1,284"
const stats = gsap.utils.toArray('.gs-stat');

if (calm) {
  // 1. Reduced motion: show the final numbers straight away and stop.
  stats.forEach((el) => { el.textContent = format(Number(el.dataset.target)); });
} else {
  // 2. Otherwise, count each one up when it arrives.
  stats.forEach((el) => {
    const counter = { value: 0 };
    gsap.to(counter, {
      value: Number(el.dataset.target),
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = format(counter.value); },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}
