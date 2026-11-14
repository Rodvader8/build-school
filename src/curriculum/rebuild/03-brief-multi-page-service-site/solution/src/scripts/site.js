import gsap from 'gsap';

// Content is visible in the HTML and CSS. Only when motion is welcome do we hide it and bring it in.
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.reveal', { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.1 });
});
