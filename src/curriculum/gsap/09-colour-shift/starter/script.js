gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const day = document.querySelector('.gs-day');
const sun = document.querySelector('.gs-sun');

// The CSS already shows dawn. Reduced motion simply keeps it, with every word readable.
if (!calm) {
  // 1. A timeline scrubbed over the whole section: start 'top top', end 'bottom bottom', scrub: 1,
  //    with ease 'none' as the default. No pin needed, the CSS (position: sticky) already holds the card.

  // 2. Three steps, each 1 second long, tweening the custom properties on the section:
  //    noon    '--day-bg': '#bfe3f2'   '--day-sun': '#fffbe8'
  //    sunset  '--day-bg': '#c98468'   '--day-sun': '#f2c9b8'
  //    dusk    '--day-bg': '#1a2748'   '--day-sun': '#f5e9d8'

  // 3. Move the sun at the same time as the first step, up (y: -260), and in the last step, down (y: 120).
}
