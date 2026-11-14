import { menu } from '@/lib/menu.js';

// TODO: link each item to its own page at /menu/<slug> with Link from next/link.
export default function MenuPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">The menu</h1>
      <ul className="mt-6 divide-y divide-oat">
        {menu.map((item) => (
          <li key={item.slug} className="flex justify-between py-3">
            <span className="font-medium">{item.name}</span>
            <span>${item.price}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
