import gsap from 'gsap';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  gsap.to('.reveal', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 });
}
