gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calm) {
  const panels = gsap.utils.toArray('.gs-panel');

  panels.forEach((panel, i) => {
    const last = i === panels.length - 1;
    gsap.from(panel, {
      opacity: 0,
      y: 60,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        // markers: true,   // switch on while you're lining things up, and off again after
        toggleActions: last ? 'play none none reverse' : 'play none none none',
      },
    });
  });
}
