import { notFound } from 'next/navigation';
import { menu } from '@/lib/menu.js';

export function generateStaticParams() {
  return menu.map((item) => ({ slug: item.slug }));
}

// Runs for each page: the title and description come from the same data as the page.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = menu.find((m) => m.slug === slug);
  if (!item) return { title: 'Item not found' };
  return { title: item.name, description: `${item.name}, $${item.price}. ${item.blurb}` };
}

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
