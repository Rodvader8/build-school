This is the project. You've learned tweens, easing, timelines, stagger, ScrollTrigger, pinning, scrubbing, drawing lines and `matchMedia`. Now you'll put all of it into one section.

**This project's brand is Willow Cove**, an invented specialist dental practice. Its "Your first visit" section is a small piece of choreography: the section pins to the screen, a ring draws itself round a dial as you scroll, and three steps hand over to each other in turn. On a phone it calms down to simple reveals. For anyone who's asked for less motion, it's just a readable list.

## The brief

The markup and CSS are done. Open `script.js` and read the brief at the top. It's written like a client's, and it has five parts:

1. **Wide, motion allowed.** The `.cb-visit` section pins for three screens. The ring draws from empty to full as you scroll. Only one step is visible at a time, crossfading at the 1 and 2 second marks of a three-second, scrubbed timeline.
2. **Narrow, motion allowed.** No pin. Each step's children fade up as that step arrives. The ring stays complete.
3. **Reduced motion.** Nothing animates. The list and the full ring just sit there.
4. **The fee cards** fade up in a wave on both motion-allowed versions.
5. **Resizing is clean.** Drag the preview across 900px and everything switches, with nothing left over.

## A plan, before code

Do what a pro does and sketch the shape first:

```js
mm.add({ wide, narrow, calm }, (context) => {
  if (calm) return;
  /* fees: both versions */
  if (!wide) { /* step reveals */ return; }
  /* wide setup, then the pinned timeline */
  return () => { /* undo the class */ };
});
```

Then fill it in one part at a time, checking each in the preview.

## One new trick: drawing a circle

A circle doesn't have a handy `pathLength` shortcut, so read its real length and use that. The circumference is 2 × π × radius:

```js
const C = 2 * Math.PI * arc.r.baseVal.value;
gsap.set(arc, { attr: { 'stroke-dasharray': C, 'stroke-dashoffset': C } });
// later: { attr: { 'stroke-dashoffset': 0 } }
```

Setting these as SVG **attributes** (with `attr`) is what Willow Cove does. It also avoids the integer-rounding gotcha from lesson 8, because attributes aren't rounded.

## Done means

Press **Check my work**. Every goal should pass, including the ones that resize the preview for you. Then do the real test: scroll slowly, scroll back, and slide the preview narrower and wider. Does anything flicker, jump, or get left behind? That's the difference between motion that *works* and motion a client would pay for.

> Want a stretch? Add a node on the ring for each step that lights up as the arc reaches it, as a finished site might. Or pick a motion you admire on any site and rebuild one moment of it.
