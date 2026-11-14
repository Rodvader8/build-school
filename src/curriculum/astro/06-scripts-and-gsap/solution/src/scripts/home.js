// Only the home page loads this file. It's bundled with GSAP, so nothing comes from a CDN.
import gsap from 'gsap';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  gsap.from('.reveal', { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out', stagger: 0.15 });
}
