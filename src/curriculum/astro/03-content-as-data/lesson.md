Open any serious Astro site and the page file is mostly *layout*. The words, prices, opening hours and testimonials live in a data file (`src/data/*.ts`), and the page simply reads from it. That separation is the point of this lesson.

It matters because content changes far more often than design. If a phone number lives in one typed object, you change it once and every page that shows it is right. If it's typed into the markup, you'll find the old number in the footer six months later.

## A data file is just TypeScript

```ts
// src/data/saltmarsh-bakehouse.ts
import type { Business } from './types';

export const saltmarsh: Business = {
  slug: 'saltmarsh-bakehouse',
  name: 'Saltmarsh Bakehouse',
  phone: '02 5550 0143',
  services: [
    { name: 'Daily loaves', blurb: 'Out of the oven by 7am.' },
  ],
  // ...
};
```

The `Business` type (from lesson 4 of the TypeScript track, if you've done it) means a missing field is a red underline, not a blank space on a live page. Open `src/data/types.ts` to see it.

## Using data in a page

Import in the top half of the `.astro` file, then loop in the bottom half:

```astro
---
import { saltmarsh } from '../data/saltmarsh-bakehouse';
---
<h1>{saltmarsh.name}</h1>
<ul>
  {saltmarsh.services.map((s) => <li>{s.name}</li>)}
</ul>
```

`.map()` turns an array into a list of elements. It's the same method you used in the JavaScript track, now producing HTML.

## One template, many pages

The starter has a page written by hand for one business, and a second business with no page at all. Writing a second hand-made page would work, but there's a better way: a **dynamic route**. A file called `[slug].astro` is a template, and a function called `getStaticPaths` tells Astro which pages to build from it:

```astro
---
import { businesses } from '../data/businesses';

export function getStaticPaths() {
  return businesses.map((business) => ({
    params: { slug: business.slug },
    props: { business },
  }));
}

const { business } = Astro.props;
---
<h1>{business.name}</h1>
```

Astro runs `getStaticPaths` at build time, gets back one entry per business, and writes one HTML file for each: `/saltmarsh-bakehouse` and `/tidepool-florist`. Add a third data file to the list and a third page appears with no other code. The `props` are what the template receives through `Astro.props`.

## Your turn

1. Run `npm install` in the terminal below, then press **Start dev server**.
2. Look at the starter page `saltmarsh-bakehouse.astro`, and compare its phone number to the one in `src/data/saltmarsh-bakehouse.ts`. They disagree. That's the problem.
3. Create `src/pages/[slug].astro` with `getStaticPaths`, and render the name, tagline, services, opening hours and a `tel:` phone link from `business`.
4. Delete `src/pages/saltmarsh-bakehouse.astro`. The template replaces it.
5. Visit both businesses from the home page, then press **Check my work**.

> Tip: invented example data should look obviously invented (`.example` email domains, `5550` phone numbers). Real details belong only in a real client's file.
