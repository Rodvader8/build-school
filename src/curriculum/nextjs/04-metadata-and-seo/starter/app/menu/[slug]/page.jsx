import { notFound } from 'next/navigation';
import { menu } from '@/lib/menu.js';

export function generateStaticParams() {
  return menu.map((item) => ({ slug: item.slug }));
}

// TODO: export an async generateMetadata({ params }) that returns the item's name as the title
// and "<name>, $<price>. <blurb>" as the description. For an unknown slug, return { title: 'Item not found' }.

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
