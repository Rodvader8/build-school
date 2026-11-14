// People who ask their device for less motion get the finished page, no animation.
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  // 1. gsap.from(): the headline starts 40px low and invisible, and settles into place.
  gsap.from('.gs-title', { y: 40, opacity: 0, duration: 1 });

  // 2. gsap.to(): the button gently pulses forever (scale up, yoyo back).
  gsap.to('.gs-cta', { scale: 1.06, duration: 0.8, repeat: -1, yoyo: true });

  // 3. gsap.fromTo(): the three cards, with both ends spelled out.
  gsap.fromTo('.gs-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
}
