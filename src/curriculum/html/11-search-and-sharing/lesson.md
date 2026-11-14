The `head` decides how your page looks **before** anyone visits it: in Google results, in AI answers and when someone shares the link on Facebook or LinkedIn. This is where SEO starts.

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fee-only financial adviser, Sydney | Larkfield Private Wealth</title>
  <meta name="description" content="Fee-only private wealth advice for Sydney families. One flat yearly fee, no commissions, and an adviser who answers the phone.">
  <link rel="canonical" href="https://larkfield.example/">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">

  <!-- Open Graph: the card shown when the link is shared -->
  <meta property="og:title" content="Larkfield Private Wealth">
  <meta property="og:description" content="One flat yearly fee. No commissions.">
  <meta property="og:image" content="https://larkfield.example/og.jpg">
  <meta property="og:url" content="https://larkfield.example/">
  <meta property="og:type" content="website">
</head>
```

| Tag | What it controls |
|---|---|
| `title` | The blue link in Google. Lead with what you do and where, then the brand. About 50 to 60 characters. |
| `meta name="description"` | The grey text under the link. Write it like an ad: 120 to 160 characters. |
| `link rel="canonical"` | "This is the one true address of this page." Stops duplicates splitting your ranking. |
| `og:*` tags | The share card on Facebook, LinkedIn and messaging apps. |
| `link rel="icon"` | The little logo on the browser tab. |

**A rule learned the hard way:** make the `og:image` a **JPG or PNG**, never WebP. Some platforms still drop WebP share images and show a blank card.

## Your turn

Fill in the `head` for the Larkfield home page:

1. A specific `title` (30 to 65 characters).
2. A `meta description` between 120 and 160 characters.
3. A `canonical` link to `https://larkfield.example/`.
4. `og:title`, `og:description` and an `og:image` that ends in `.jpg` or `.png`.
5. A favicon `link`.
