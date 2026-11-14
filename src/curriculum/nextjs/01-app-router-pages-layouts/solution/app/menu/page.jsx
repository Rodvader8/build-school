import Link from 'next/link';
import { menu } from '@/lib/menu.js';

export default function MenuPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">The menu</h1>
      <ul className="mt-6 divide-y divide-oat">
        {menu.map((item) => (
          <li key={item.slug} className="flex justify-between py-3">
            <Link href={`/menu/${item.slug}`} className="font-medium underline-offset-4 hover:underline">
              {item.name}
            </Link>
            <span>${item.price}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
