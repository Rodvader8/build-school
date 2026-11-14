'use client';

import { useState } from 'react';
import ProductCard from './ProductCard.jsx';
import AddToOrder from './AddToOrder.jsx';

const categories = ['All', 'Bread', 'Pastry'];

// Only the filter needs state, so only this part ships as client JavaScript.
export default function MenuBrowser({ items }) {
  const [category, setCategory] = useState('All');
  const shown = category === 'All' ? items : items.filter((item) => item.category === category.toLowerCase());

  return (
    <>
      <div role="group" aria-label="Filter by category" className="flex gap-2">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === category}
            onClick={() => setCategory(name)}
            className="rounded-full border border-crust px-4 py-1.5 text-sm aria-pressed:bg-crust aria-pressed:text-cream"
          >
            {name}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {shown.map((item) => (
          <ProductCard key={item.slug} item={item}>
            <AddToOrder name={item.name} />
          </ProductCard>
        ))}
      </div>
    </>
  );
}
