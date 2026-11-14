'use client';

import { useState } from 'react';
import { menu } from '@/lib/menu.js';
import ProductCard from '@/components/ProductCard.jsx';

// TODO: this whole page is a client component, so the menu data (supplier notes included)
// ships to every visitor. Move the filter into components/MenuBrowser.jsx, add components/AddToOrder.jsx,
// and make this page a server component again.
export default function MenuPage() {
  const [category, setCategory] = useState('All');
  const shown = category === 'All' ? menu : menu.filter((item) => item.category === category.toLowerCase());

  return (
    <>
      <h1 className="text-3xl font-bold">The menu</h1>
      <div role="group" aria-label="Filter by category" className="mt-4 flex gap-2">
        {['All', 'Bread', 'Pastry'].map((name) => (
          <button key={name} type="button" aria-pressed={name === category} onClick={() => setCategory(name)} className="rounded-full border border-crust px-4 py-1.5 text-sm aria-pressed:bg-crust aria-pressed:text-cream">
            {name}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {shown.map((item) => (
          <ProductCard key={item.slug} item={item} />
        ))}
      </div>
    </>
  );
}
