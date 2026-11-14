import gsap from 'gsap';

// Content is visible by default. Only when motion is welcome do we hide it, then bring it in.
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.reveal', { opacity: 0, y: 28, duration: 0.8, ease: 'power2.out', stagger: 0.12 });
});
