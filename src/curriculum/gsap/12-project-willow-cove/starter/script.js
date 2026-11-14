// Project: rebuild the motion of "Your first visit" on Willow Cove.
//
// The brief
//   Wide screen, motion allowed:
//     - The visit section is pinned for '+=300%' of scrolling, scrubbed (scrub: 1).
//     - The arc draws round the dial as you scroll, from nothing to a full circle.
//     - Only one step shows at a time. Step 1 first, then a short crossfade to step 2 at the
//       1 second mark, and to step 3 at the 2 second mark. Give the timeline a length of 3 seconds.
//   Narrow screen, motion allowed:
//     - No pin. Each step's children fade up (stagger 0.08) as that step arrives ('top 84%').
//     - The arc stays fully drawn.
//   Reduced motion: nothing animates. Everyone sees the plain list with a full dial.
//   Both of the motion-allowed versions:
//     - The three .cb-fee cards fade up with a stagger as .cb-fees arrives ('top 85%').
//   When the screen changes size, everything must switch cleanly, with no leftovers.
//
// Tools you've already used
//   gsap.matchMedia() with wide, narrow and calm conditions (lesson 11), and a cleanup function
//   a scrubbed, pinned timeline (lesson 6), autoAlpha crossfades (lesson 6), stagger (lesson 4)
//   dashed-line drawing (lesson 8). Here the arc is a circle, so use its real circumference:
//     const C = 2 * Math.PI * arc.r.baseVal.value;
//     gsap.set(arc, { attr: { 'stroke-dasharray': C, 'stroke-dashoffset': C } });
//   and later tween it with { attr: { 'stroke-dashoffset': 0 } }.

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector('.cb-visit');
const arc = document.querySelector('.cb-arc');
const steps = gsap.utils.toArray('.cb-step');

// Your code here.
