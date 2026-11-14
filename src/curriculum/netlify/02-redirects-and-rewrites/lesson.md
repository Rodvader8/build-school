You've rebuilt a client's site and the URLs changed. `/services.html` is now `/services`, the news section became a blog. If you do nothing, every old link on Google, in emails and on other sites turns into a 404, and the ranking those pages earned goes with them. Redirects are how you carry it across.

## A rule is four things

In `netlify.toml`, each redirect is a `[[redirects]]` block:

```toml
[[redirects]]
  from = "/services.html"
  to = "/services"
  status = 301
```

Netlify checks rules **top to bottom and the first match wins**. That one sentence causes most redirect bugs: put a catch-all at the top and nothing below it ever runs.

## Status codes

| Status | Meaning | Address bar |
|---|---|---|
| `301` | Moved permanently. Search engines pass the old page's ranking on. | Changes |
| `302` | Moved temporarily. Search engines keep the old URL. | Changes |
| `200` | A **rewrite**. Serve a different file but pretend nothing moved. | Stays the same |
| `404` | Show this page, with a not-found status. | Stays the same |

Use 301 for anything that's moved for good. Use 200 when one page, such as a single-page app, handles many URLs: `/app/settings` and `/app/profile` should both serve `/app/index.html` while the URL stays put.

## Splats and placeholders

A **splat** is a `*` that swallows the rest of a path, and it can only appear at the **end**:

```toml
[[redirects]]
  from = "/news/*"
  to = "/blog/:splat"
  status = 301
```

`/news/2024/launch` becomes `/blog/2024/launch`. A pattern like `/*/blog` isn't valid, because a splat in the middle can't be matched. If you need one segment, use a placeholder instead: `from = "/team/:name"`, `to = "/about/:name"`.

## Real files win

By default a rule doesn't apply when a real file already exists at that path. That's called shadowing, and it's why a catch-all `/*` pointing at your 404 page doesn't break every working page. You can override it with `force = true`, but you rarely should.

## Your turn

The checks include a small matcher that behaves like Netlify's: it reads your rules in order, skips any whose path is a real file, and tells you what each URL would do. Nothing is deployed.

1. Open `netlify.toml`. It has four rules, and some are wrong.
2. Make `/services.html` a **301** to `/services`.
3. Fix the broken `/*/blog` rule so that `/news/*` goes to `/blog/:splat` with a 301.
4. Make `/app/*` a **200** rewrite, not a redirect.
5. Add `/old-contact` as a 301 to `/contact`.
6. Move the catch-all so it's the last rule.
7. Press **Check my work**.
