gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = matchMedia('(min-width: 900px) and (min-height: 620px)').matches;
const section = document.querySelector('.gs-chapters');
const chapters = gsap.utils.toArray('.gs-chapter');

// Only the wide, motion-allowed version is pinned. Everyone else keeps the plain stacked chapters.
if (wide && !calm) {
  // 1. Stack the chapters, and hide chapters 2 and 3 to start.
  section.classList.add('is-pinned');
  gsap.set(chapters.slice(1), { autoAlpha: 0 });

  // 2. One timeline, tied to the scroll bar, pinning the section while it plays.
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top top', end: '+=300%', pin: true, scrub: 1 },
  });

  // 3. Fill the timeline.
  tl.to(chapters[0], { autoAlpha: 0 }, 1)
    .to(chapters[1], { autoAlpha: 1 }, 1)
    .to(chapters[1], { autoAlpha: 0 }, 3)
    .to(chapters[2], { autoAlpha: 1 }, 3)
    .to({}, { duration: 1 });
}
