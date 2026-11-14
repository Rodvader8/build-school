gsap.registerPlugin(ScrollTrigger);

const band = document.querySelector('.gs-band');
const bandText = document.querySelector('.gs-band__text');

// Make a gsap.matchMedia() and add ONE function to it, with three named conditions:
//   wide:   '(min-width: 900px)'
//   narrow: '(max-width: 899px)'
//   calm:   '(prefers-reduced-motion: reduce)'
// Inside the function, read them with: const { wide, calm } = context.conditions;
// (matchMedia only runs your function when at least one condition matches. That's why narrow needs its own.)
//
//   calm  -> return straight away. Nothing animates, the page stays as it is in the CSS.
//   wide  -> add the class is-pinned to the band, then slide the text left (xPercent: -55, ease 'none')
//            with a scrubbed, pinned ScrollTrigger on the band: start 'top top', end '+=100%'.
//   else  -> a gentle reveal: gsap.from('.gs-fade', { opacity: 0, y: 30, stagger: 0.1 }) with a
//            scrollTrigger on '.gs-fades', start 'top 85%'.
//
// Last, return a cleanup function that removes the is-pinned class again, because matchMedia
// undoes GSAP's work for you, but it can't know about a class you added yourself.
