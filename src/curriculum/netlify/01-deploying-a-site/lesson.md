A deploy is the moment your project turns into a live website. You push code, Netlify runs your **build command** in a clean container, takes the folder you told it to **publish**, and puts that folder on its worldwide network. Most modern client sites ship this way.

Two settings do nearly all the work, and getting either one wrong gives you a failed deploy or, worse, a live site that's empty.

| Setting | Question it answers |
|---|---|
| `command` | What do I run to turn the source into a finished site? |
| `publish` | Which folder holds the finished site afterwards? |

## Settings live in netlify.toml

You can click these into the Netlify dashboard, but a `netlify.toml` file in your repo is better: it's versioned, reviewable and travels with the code.

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

Pin `NODE_VERSION`. If you don't, your laptop and Netlify can quietly run different Node versions and a build that works here fails there.

## Deploy previews

Every pull request gets its own temporary URL, called a **deploy preview**. It's perfect for showing a client a change before it's live. Netlify tells your build which kind of deploy it is through a *context*, and you can override settings per context:

```toml
[context.deploy-preview.environment]
  SITE_ENV = "preview"
```

Why bother? A preview is a real, public web page. If Google finds it, you have two copies of your site competing in search. So the build script in this lesson adds `<meta name="robots" content="noindex">` whenever `SITE_ENV` is `preview`, and leaves it out of the live site. Open `build.mjs` to see how little code that takes.

> Never put a password, API key or token in `netlify.toml`. It's committed to Git and anyone with repo access can read it. Secrets go in the Netlify dashboard (Site configuration, then Environment variables) and in a git-ignored `.env` on your own machine.

## Your turn

Nothing here deploys anywhere. There's no Netlify account and no login: the checks read your `netlify.toml` and run your build command right here, the same way Netlify would.

1. In the terminal, run `npm run build` and look at what appears. That's the folder to publish.
2. Open `netlify.toml`. The command and the publish folder are both wrong. Fix them.
3. Add a `[build.environment]` table that sets `NODE_VERSION` to `"22"`.
4. Add a `[context.deploy-preview.environment]` table that sets `SITE_ENV` to `"preview"`.
5. Press **Check my work**. It builds your site twice, once as a preview and once as the live site, and compares the two.
