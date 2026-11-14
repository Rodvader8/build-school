Here's a trap worth knowing about. You can run `npm audit` on a site every week, get "0 vulnerabilities" every time, and still have no Content Security Policy at all. `npm audit` reads your **dependencies**. It can't see the **headers** your server sends, so it has nothing to say about their absence. Dozens of clean audits prove one thing only: your packages are fine.

Security headers are instructions your server sends along with every page. The browser obeys them. The most powerful one is **Content-Security-Policy (CSP)**: a list of exactly where a page is allowed to load things from. If an attacker manages to inject a script tag, a good CSP means the browser refuses to run it.

## The shape of a policy

```
Content-Security-Policy: default-src 'self'; img-src 'self' https://images.example-cdn.com
```

`default-src 'self'` says "anything not mentioned below may only come from my own domain". Then you add exceptions per type of thing:

| Directive | Controls |
|---|---|
| `script-src` | JavaScript files (and inline scripts) |
| `img-src` | Images |
| `connect-src` | `fetch`, XHR, beacons |
| `frame-src` | Iframes you embed (a video, a map) |
| `style-src`, `font-src` | CSS and fonts |

Name hosts exactly: `https://www.googletagmanager.com`, not `https:` and never `*`. And avoid `'unsafe-inline'` and `'unsafe-eval'` in `script-src`: they switch off the protection you're adding the policy for.

A few directives have **no fallback**, so `default-src` doesn't cover them. Set them yourself: `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` and `frame-ancestors 'self'`.

## Where headers live

On Netlify, a plain text file called `_headers` in your publish folder:

```
/*
  X-Content-Type-Options: nosniff
  Content-Security-Policy: default-src 'self'; ...
```

The same rules can go in `netlify.toml` under `[[headers]]`. Use whichever you like, but not both for the same header.

## Allow exactly what loads, no more

The page in `site/` is a typical small business page. It loads its own CSS and script, plus a Google tag, an image from a CDN, an embedded video, and it sends an analytics beacon. A policy that only says `default-src 'self'` breaks all four. A policy that says `*` breaks nothing and protects nothing. The goal sits between: every host the page needs, and nothing else.

Check my work loads the built page in a real browser with your policy applied, and counts the violations. It also tries to inject a script from a made-up host to prove your policy still says no.

## Your turn

1. Start the preview with **Start dev server** and open the browser console. See the violations?
2. Open `site/_headers`. Build a policy that keeps the page working: add the four hosts to the right directives.
3. Add `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` and `frame-ancestors 'self'`.
4. Add the other headers: `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` and `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
5. Press **Check my work**.

The image and video hosts are stand-ins, so in the preview they show as empty boxes. That's fine: the checks answer them with test stubs.
