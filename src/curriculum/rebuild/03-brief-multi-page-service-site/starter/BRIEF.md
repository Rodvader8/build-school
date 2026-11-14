# Brief: Ironbark Landscape Studio

A four-page service site for an invented business, with a working enquiry form. Build it, then run the gate (`npm run gate`) until every line says PASS. It should sit comfortably next to any well-built service-business site.

## The business

Ironbark is a three-person landscape studio in Wattlebrook, on the Victorian coast. They design, build and plant low-water gardens for homes, and they'd rather do ten gardens well than thirty badly.

## The audience

Homeowners in their thirties to sixties, usually with a garden that's failing: too thirsty, too windy, or just never finished. They're comparing two or three studios. They want to know who will turn up, what it costs to start, and whether the work is good. A visitor should be able to send an enquiry in under a minute.

## The pages

Four pages, each at its own address:

- **Home** (`/`). Headline, intro, a button to the contact page, a row of three stats, three recent gardens with an image each, and a customer quote.
- **Services** (`/services/`). The three services as cards: title, summary and what each includes.
- **About** (`/about/`). The story, the team of three, and the three values. One photograph.
- **Contact** (`/contact/`). The enquiry form, the direct details and hours, and four questions in `details` and `summary`.

Every page shares one header with the main navigation (the link for the current page is marked with `aria-current="page"`) and one footer.

## The enquiry form

Fields: name, email, phone (optional), what they need (a select with a choice for each service plus "Not sure yet") and a message. It posts to Netlify Forms with `data-netlify`, so no JavaScript is involved. Name, email and message are required. Every field has a visible label and the right `type` and `autocomplete`. Add a honeypot field that people can't see or tab to.

## The content

All the words, the alt text for each image and each page's title and description are in `src/data/ironbark.js`. Don't type any of it into a template. The navigation list is in there too.

## The assets

`src/assets/fonts` has DM Serif Display (display) and Figtree (body). `src/assets/img` has `hero`, `project-1` to `project-3` and `about`. `public/og.jpg` is the share image. Self-host the fonts.

## Tone

Warm, practical and local. A tradesperson explaining their work to a neighbour, not an agency selling a package. Plain words. No hype.

## Must-haves

- One layout, one header component and one footer component, used by all four pages.
- Each page has one `h1`, its own title and description, a canonical link, Open Graph tags (JPG `og:image`) and JSON-LD.
- Light motion is fine, but it must stop when the visitor asks for reduced motion, and nothing may be hidden without it.
- A Content-Security-Policy in `netlify.toml` that the form and the pages work under.
- Every internal link goes to a page that exists.
- Classes only. No `style` attributes.
