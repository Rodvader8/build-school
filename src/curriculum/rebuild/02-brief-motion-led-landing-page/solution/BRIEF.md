# Brief: Halden Audio

A landing page for an invented business. Build it, then run the gate (`npm run gate`) until every line says PASS. The page should hold its own next to any well-built motion-led site.

## The business

Halden Audio is a three-person workshop in Corrigan Bay, Tasmania. They build loudspeakers by hand, to order, with an eight to ten week wait. They sell two models and nothing else.

## The audience

People in their late thirties to sixties who already own good equipment and care how it sounds. They read specifications. They distrust hype. They'll travel for a listening session, but only if the page makes them believe the workshop is serious.

## The page

One page, four sections after the hero. The ids matter:

- **Hero.** The `h1` (the headline from the data), a short intro, and a button that goes to the listening section. A full-height hero image sits behind the text.
- **`#philosophy`.** The three statements, large and spaced out. Use a visually hidden `h2` so the heading order holds.
- **`#speakers`.** Each speaker has an image, its name, tagline, description and its specs in a description list (`dl`, `dt`, `dd`).
- **`#craft`.** The four steps, in an ordered list, beside the room image.
- **`#listening`.** The customer's quote, then the call to action with an email link (`mailto:`) and a phone link (`tel:`).

Add a header with a skip link and a footer.

## The content

Everything the page says is in `src/data/halden.js`. Don't type any of that copy into a template. The alt text for each image is in there too. The `title`, `description` and `url` feed the head and the JSON-LD.

## The assets

`src/assets/fonts` has Instrument Serif (display) and Geist (body). `src/assets/img` has `hero`, `driver`, `walnut` and `room`. `public/og.jpg` is the share image. Self-host the fonts. Don't link to any CDN.

## Tone

Calm, exact, a little dry. Short sentences. Space does the talking. No hype words: if "stunning" would fit, the copy isn't specific enough.

## Must-haves

- Motion leads. The headline arrives word by word. Sections ease in as they scroll into view. The photographs drift at a different speed from the page. A line beside the craft steps fills as you scroll. All of it is GSAP and ScrollTrigger from npm.
- With reduced motion switched on, none of that runs and everything is simply visible.
- A Content-Security-Policy in `netlify.toml`, and a page that loads under it.
- Every image has a width, a height and real alt text. Only the hero loads eagerly.
- The head has a canonical link, Open Graph tags (with a JPG `og:image`) and JSON-LD built from the data.
- Classes only. No `style` attributes.
