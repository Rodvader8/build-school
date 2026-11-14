A layout wraps a whole page. A **component** is a smaller reusable piece: a product card, a testimonial, a button. A real site is mostly components, and they're how a 2,000-line page stays readable.

## Make a component

A component is another `.astro` file, kept in `src/components`. Names start with a capital letter, which is how Astro tells `<ProductCard />` apart from an ordinary HTML tag.

```astro
---
interface Props {
  name: string;
  price: number;
  href?: string;   // the ? means optional
}

const { name, price, href } = Astro.props;
---
<article class="product-card">
  <h3>{href ? <a href={href}>{name}</a> : name}</h3>
  <p class="price">${price.toFixed(2)}</p>
  <slot />
</article>
```

Three things are happening:

- The `Props` interface describes what the component accepts. It's TypeScript, so your editor autocompletes the props and complains when you forget one.
- `Astro.props` holds the values the page passed in. You pull them out with destructuring.
- `<slot />` is where anything written between the component's tags lands.

## Use it

```astro
---
import ProductCard from '../components/ProductCard.astro';
---
<ProductCard name="Country loaf" price={9}>
  <p>A 36-hour sourdough with a blistered crust.</p>
</ProductCard>
```

Notice the two kinds of attribute. `name="Country loaf"` is a plain string. `price={9}` has braces because it's a JavaScript value (a number). If you wrote `price="9"` you'd be passing text, and the editor would flag it.

The `${price.toFixed(2)}` bit is a literal dollar sign followed by an Astro expression. `toFixed(2)` turns `9` into `9.00`.

## Why bother

Say the owner wants the price in bold, or a "sold out" badge. With three copies of the card you'd edit three places and probably miss one. With a component it's one edit. And because the markup lives in one file, every card is guaranteed to be consistent.

Components are plain HTML at build time. Nothing here sends JavaScript to the browser.

## Your turn

1. In the terminal below, run `npm install`, then press **Start dev server** above the preview.
2. Create `src/components/ProductCard.astro` with a `Props` interface (`name`, `price`, optional `href`), the markup from one of the cards, and a `<slot />` for the description.
3. Open `src/pages/index.astro`. Import the component and replace the three hand-written cards with three `<ProductCard>` tags. Pass the description as the content between the tags.
4. Give one card `href="/menu"` so you can see an optional prop in action.
5. Press **Check my work**.

> Tip: a typo in a prop name doesn't crash anything. The prop simply arrives as `undefined`. A typed `Props` interface is what turns that silent mistake into a red underline.
