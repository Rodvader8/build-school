const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // 1. The eight tiles: a stagger of 0.08 seconds between each one.
  gsap.from('.gs-tile', { opacity: 0, y: 30, duration: 0.6, stagger: 0.08 });

  // 2. The twelve dots: 0.9 seconds spread across all of them, rippling out from the middle.
  gsap.from('.gs-dot', { opacity: 0, scale: 0, duration: 0.5, delay: 0.8, stagger: { amount: 0.9, from: 'center' } });
}
