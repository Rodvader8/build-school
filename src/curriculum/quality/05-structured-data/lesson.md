Search engines and AI assistants read your page the way a person skims a stranger's handwriting: they can mostly work it out, but they'd love to be told. **Structured data** is you telling them, in a standard format: this is a business, this is its phone number, these are the services, these are the questions people ask.

The format is **JSON-LD**: a block of JSON inside a `<script type="application/ld+json">` tag. Visitors never see it, and it doesn't touch your layout.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Blue Gum Landscaping",
  "url": "https://bluegum.example/",
  "telephone": "+61 400 000 000"
}
</script>
```

`@context` says which vocabulary (schema.org, always written with `https`). `@type` says what kind of thing this is, and everything else describes it.

## The three types most small business sites need

- **LocalBusiness** (or a more specific subtype): who you are, how to reach you, where you work.
- **Service**: each thing you sell, linked back to the business as its `provider`.
- **FAQPage**: the questions people really ask, each with its answer.

## Suburb, never a street address

A business that's run from someone's home shouldn't publish the home address, on the page *or* in the schema. Give the `address` as a `PostalAddress` with only `addressLocality` (suburb), `addressRegion` (state) and `addressCountry`. Then use **`areaServed`** to list where you actually work.

```json
"address": { "@type": "PostalAddress", "addressLocality": "Northcote", "addressRegion": "VIC", "addressCountry": "AU" },
"areaServed": ["Northcote", "Thornbury", "Preston"]
```

Leave `streetAddress` out entirely. Leaving it empty isn't the same as omitting it.

## Match what's on the page

For FAQPage there's one hard rule: every question and answer in the schema must also be **visible** to visitors, word for word. Schema that describes content that isn't there looks like a trick, and search engines treat it as one. Write the page first, then copy the text into the JSON.

## Validate it

Search engines won't tell you when your markup is wrong, they just ignore it. The usual culprit is a trailing comma or a missing quote, which makes the whole block invalid JSON. Real validators exist (Google's Rich Results Test and the schema.org validator) but they need a public URL. The checks here do the same job on your local file: parse every block, then confirm the required fields.

## Your turn

Open `site/index.html`. The starter has three blocks, and they've got problems.

1. Run the check once and fix any block that isn't valid JSON.
2. In **LocalBusiness**: add `telephone`, `description` and `areaServed`. Replace the address with suburb, region and country only.
3. In **Service**: add a `serviceType`, a `description` and `areaServed`, and make `provider` point to the business by name.
4. In **FAQPage**: the page shows three questions. Put all three in `mainEntity`, with the answers matching the page word for word.
5. Make sure no street address is left anywhere in the file.
6. Press **Check my work**.
