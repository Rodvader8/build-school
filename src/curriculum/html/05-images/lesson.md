Images are a single tag with no closing part. Four attributes do the work.

```html
<img src="images/headland.svg"
     alt="A rocky headland at sunrise above a calm sea"
     width="1200" height="600">
```

| Attribute | Why it matters |
|---|---|
| `src` | Where the file is. `images/headland.svg` means "the headland.svg file inside the images folder next to this page". That's a **relative path**. |
| `alt` | Words that replace the image for blind visitors, for Google, and when the image fails to load. Describe what's in it, as if on the phone to someone. |
| `width` and `height` | The image's real size. The browser reserves the space before the file arrives, so the page doesn't jump around. Google measures that jumping (it's called **CLS**). |

## Captions

When an image needs a caption, wrap both in a `figure`:

```html
<figure>
  <img src="..." alt="...">
  <figcaption>The headland below our Sydney office.</figcaption>
</figure>
```

## Your turn

Open the **Explorer** (the files icon on the far left of the editor) and you'll see an `images` folder with `headland.svg` in it.

1. Inside the `figure`, add an `img` that shows `images/headland.svg`.
2. Write a useful `alt` (at least a few words).
3. Set `width="1200"` and `height="600"`.
4. Add a `figcaption` under the image.
