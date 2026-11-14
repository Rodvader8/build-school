gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = matchMedia('(min-width: 900px) and (min-height: 620px)').matches;
const section = document.querySelector('.gs-hscroll');
const track = document.querySelector('.gs-track');

// How far the track has to travel: its full width, minus the one screen you can already see.
const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

if (wide && !calm) {
  section.classList.add('is-pinned');

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}
