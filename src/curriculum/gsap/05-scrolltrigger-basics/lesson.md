So far everything has played on page load. Real pages are longer than the screen, and a reveal that finished before anyone scrolled to it is wasted. **ScrollTrigger** is GSAP's plugin for starting animations (and later, scrubbing them) at the right spot on the page. Most scroll-driven sites depend on it.

It ships as a separate script, so the page loads it after GSAP, and your code registers it once:

```js
gsap.registerPlugin(ScrollTrigger);
```

## Attach it to a tween

```js
gsap.from('.card', {
  opacity: 0,
  y: 60,
  scrollTrigger: { trigger: '.card', start: 'top 85%' },
});
```

The tween waits. When the trigger hits its start point, it plays once, at its normal duration. That's the pattern Carrow & Finch, Willow Cove and the rest use for most of their reveals.

## Reading `start`

`start: 'top 85%'` has two halves, and people mix them up:

- **First word:** the point on the **element** (`top`, `center`, `bottom`, or a number).
- **Second word:** the point on the **screen** (`top`, `center`, `bottom`, or a percentage).

So `'top 85%'` means "when the top of the element reaches 85% of the way down the screen". Reveal a little before something is fully in view, and it feels responsive, not late.

## Loop for many elements

To give each card its own trigger, loop. Using the element itself as the trigger means each one reveals when *it* arrives:

```js
gsap.utils.toArray('.card').forEach((card) => {
  gsap.from(card, { opacity: 0, y: 60, scrollTrigger: { trigger: card, start: 'top 85%' } });
});
```

## What happens when you scroll away

`toggleActions` decides the behaviour at four moments: entering, leaving, entering backwards, leaving backwards. The default is `'play none none none'`: play once, then leave it alone. Change the last word to `reverse` and it un-plays when you scroll back above it.

## See what you're doing

```js
scrollTrigger: { trigger: card, start: 'top 85%', markers: true }
```

`markers: true` draws the start and end lines on the page. Use it every time you're confused, then remove it.

## Your turn

1. Loop over the four `.gs-panel` cards. Give each a `gsap.from` (`opacity: 0`, `y: 60`, `duration: 0.9`, `ease: 'power3.out'`) with a ScrollTrigger on the panel, starting at `'top 85%'`.
2. Make the **last** panel use `toggleActions: 'play none none reverse'`.
3. If you turned `markers` on while testing, switch them off again.

Scroll the preview to test it. Press reload to start over.
