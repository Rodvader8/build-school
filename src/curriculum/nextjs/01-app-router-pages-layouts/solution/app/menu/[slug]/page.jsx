import { notFound } from 'next/navigation';
import { menu } from '@/lib/menu.js';

// Tells Next which slugs to build as static pages ahead of time.
export function generateStaticParams() {
  return menu.map((item) => ({ slug: item.slug }));
}

// In Next 16, params is a Promise. Always await it.
export default async function ItemPage({ params }) {
  const { slug } = await params;
  const item = menu.find((m) => m.slug === slug);
  if (!item) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold">{item.name}</h1>
      <p className="mt-2 text-xl text-crust-dark">${item.price}</p>
      <p className="mt-4">{item.blurb}</p>
    </article>
  );
}
