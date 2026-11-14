'use client';

import { useState } from 'react';

export default function AddToOrder({ name }) {
  const [count, setCount] = useState(0);

  return (
    <div className="mt-3 flex items-center gap-3">
      <button type="button" aria-label={`Add ${name} to order`} onClick={() => setCount(count + 1)} className="rounded-full bg-crust px-4 py-1.5 text-sm font-semibold text-cream">
        Add
      </button>
      <span role="status" className="text-sm">In your order: {count}</span>
    </div>
  );
}
