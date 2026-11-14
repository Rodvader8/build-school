A page can be perfect and still be invisible. Search engines, social networks and AI assistants all read your site, and each of them looks for a few specific, machine-friendly signals. This lesson adds them to the Saltmarsh Bakehouse layout, so every page gets them for free.

## Head tags that matter

```astro
<link rel="canonical" href={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
```

- The **canonical** link tells search engines the one true address of a page, so duplicates don't compete.
- The **Open Graph** (`og:`) tags decide how the page looks when someone shares it. They use `property`, not `name`.
- `og:image` needs a full `https://` address and must be a JPG or PNG. WebP and AVIF won't show up everywhere.
- Aim for a meta description of roughly 70 to 160 characters, and one `<h1>` per page.

Astro knows your domain from `site` in `astro.config.mjs`, available as `Astro.site`. That's how you build full addresses: `new URL('/og.jpg', Astro.site).href`.

## JSON-LD: say it in a language machines read

JSON-LD is a block of structured data that states facts outright, using the shared vocabulary at schema.org. Instead of a crawler guessing that "02 5550 0143" is a phone number, you tell it:

```json
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Saltmarsh Bakehouse",
  "telephone": "+61 2 5550 0143",
  "address": { "@type": "PostalAddress", "addressLocality": "Tidewater Bay", "addressRegion": "NSW" }
}
```

In Astro you build it as a normal object, from your data file, and print it with `set:html` (needed so the quotes aren't escaped):

```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

Because it comes from the same data as the page, the two can't drift apart.

Two real-world cautions. First, only publish an address you want the public to have: a suburb is plenty for most trades, and this lesson's schema deliberately leaves out `streetAddress`. Second, this bakery is invented. On the open web you should never publish business markup for a business that doesn't exist, since it tells search engines something false. In a real client site, this is the block you'd ship.

## llms.txt and robots.txt

Two plain text files in `public/` are copied to the root of your site:

- `robots.txt` tells crawlers what they may read.
- `llms.txt` is a short, Markdown-style summary written for AI assistants: a `# Name`, a `> one-paragraph summary`, then lists of links and key facts. It isn't a standard that every assistant uses yet, but it costs ten minutes and gives a model a clean version of who you are.

## Your turn

1. Run `npm install` in the terminal below, then press **Start dev server**. View the page source: the head is nearly empty.
2. In `src/layouts/Base.astro`, add the canonical link, the Open Graph tags (the share image is `public/og.jpg`) and the JSON-LD script. Build the `schema` object from `business` (type `Bakery`, suburb-only address, opening hours).
3. Create `public/llms.txt` and `public/robots.txt`. Link to `https://saltmarsh.example/` and list the three services.
4. Press **Check my work**. It parses your JSON-LD, so a stray comma shows up as a failure.

> Tip: Google's Rich Results Test and the schema.org validator will read your JSON-LD once a real site is live. For now, the check does the same job offline.
