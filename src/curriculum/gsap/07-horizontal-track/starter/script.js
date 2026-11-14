gsap.registerPlugin(ScrollTrigger);

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = matchMedia('(min-width: 900px) and (min-height: 620px)').matches;
const section = document.querySelector('.gs-hscroll');
const track = document.querySelector('.gs-track');

// How far the track has to travel: its full width, minus the one screen you can already see.
const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

if (wide && !calm) {
  // 1. Add the class is-pinned to the section.

  // 2. Tween the track's x to minus the distance, with ease 'none'.
  //    Use a FUNCTION for the value: x: () => -distance(). That way it's measured again if the window is resized.

  // 3. Give it a scrollTrigger on the section: start 'top top', pin: true, scrub: 1,
  //    end: () => '+=' + distance()   (scroll exactly as far as the track travels),
  //    and invalidateOnRefresh: true so GSAP re-reads those functions on resize.
}
