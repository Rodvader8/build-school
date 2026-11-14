const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Build a timeline called intro, with defaults of { duration: 0.8, ease: 'power3.out' }.
//    It plays as soon as it's made.

// 2. Add four steps, in this order:
//    kicker  from { y: 20, opacity: 0 }
//    title   from { y: 40, opacity: 0 }, starting 0.5s before the kicker ends ('-=0.5')
//    lede    from { y: 30, opacity: 0 }, starting with the title ('<'), delayed 0.15s ('<0.15')
//    button  from { scale: 0.9, opacity: 0 }

// 3. Make the Replay button restart the timeline.
