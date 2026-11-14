import Link from 'next/link';
import { menu } from '@/lib/menu.js';

// TODO: export a metadata object with a title and description.
export default function MenuPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">The menu</h1>
      <ul className="mt-6 divide-y divide-oat">
        {menu.map((item) => (
          <li key={item.slug} className="py-3">
            <Link href={`/menu/${item.slug}`} className="underline-offset-4 hover:underline">{item.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
