Time to put the whole track together. You'll build the marketing site for an invented business, **Ironbark Surf School**: the kind of small multi-page site you'd deliver for a local client, and a very common shape for a production site. This one is yours to assemble, with no step-by-step.

## The brief

| Page | URL | What's on it |
|---|---|---|
| Home | `/` | One `h1`, a hero image, three reasons to book, a link to the lessons, and an FAQ |
| Lessons | `/lessons` | A card for each lesson, linking to its page |
| A lesson | `/lessons/<slug>` | Its level, price, duration and blurb, plus a booking link |
| Contact | `/contact` | The enquiry form |
| Not found | any bad URL | A friendly "Page not found" |

Behind the pages: an `/api/enquiry` route, a sitemap and robots file. Every page needs its own title and description, a canonical link and the shared Open Graph image.

## What's done for you

The data (`lib/data.js`), the site facts (`lib/site.js`), the fonts, the images, the enquiry form, and the validation and notification code are in place, plus `tests/` describing everything else. The data is a plain module here, but `await` a `use cache` function the same way you did in lesson 3 and it could come from a real API.

## The checklist behind the checks

Each point maps to a lesson earlier in the track:

- **Layouts and routes**: root layout with nav and footer, a dynamic `[slug]` route with `generateStaticParams`, `notFound()`.
- **Server and client**: only `EnquiryForm` says `"use client"`. The FAQ is `<details>` and `<summary>`, which need no JavaScript at all.
- **Metadata**: a title template, `generateMetadata` for lessons, canonical via `metadataBase`, a JPG for `og:image`.
- **Images and fonts**: `<Image>` with width, height and `sizes`, `preload` on the hero only, `localFont` for both fonts from committed files.
- **Route handler**: parse safely, honeypot, validate, then respond with the right status. The address comes from `process.env`.

## Your turn

1. In the terminal, run `npm install`, then press **Start dev server** above the preview. You'll see a bare heading.
2. Open `tests/` and skim both files. They describe what to build.
3. Start with `app/layout.jsx`: fonts, metadata, nav, main and footer.
4. Build the home page, then `app/lessons/page.jsx`, then `app/lessons/[slug]/page.jsx`, then `app/contact/page.jsx` (the form is ready to drop in).
5. Add `app/api/enquiry/route.js`, `app/sitemap.js`, `app/robots.js` and `app/not-found.jsx`.
6. Press **Check my work** as you go, and fix one failing line at a time. The build and the tests both run, so you'll see problems in the code and in the generated HTML.

> Tip: work through the pages in the order above and keep the dev server open. Each new route appears in the preview the moment you save the file.
