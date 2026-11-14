gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const day = document.querySelector('.gs-day');
const sun = document.querySelector('.gs-sun');

// The CSS already shows dawn. Reduced motion simply keeps it, with every word readable.
if (!calm) {
  // 1. One timeline over the whole section. The CSS (position: sticky) holds the card in place.
  const tl = gsap.timeline({
    defaults: { ease: 'none', duration: 1 },
    scrollTrigger: { trigger: day, start: 'top top', end: 'bottom bottom', scrub: 1 },
  });

  // 2. Dawn is in the CSS. Each step moves to the next light.
  tl.to(day, { '--day-bg': '#bfe3f2', '--day-sun': '#fffbe8' })
    .to(day, { '--day-bg': '#c98468', '--day-sun': '#f2c9b8' })
    .to(day, { '--day-bg': '#1a2748', '--day-sun': '#f5e9d8' });

  // 3. The sun rises with the first step and sets with the last.
  tl.to(sun, { y: -260 }, 0).to(sun, { y: 120 }, 2);
}
