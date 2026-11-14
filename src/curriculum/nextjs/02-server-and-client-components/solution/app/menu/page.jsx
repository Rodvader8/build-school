import { menu } from '@/lib/menu.js';
import MenuBrowser from '@/components/MenuBrowser.jsx';

// A server component: it can read server-only data and it ships no JavaScript of its own.
export default function MenuPage() {
  // Props to a client component are sent to the browser, so strip the internal field first.
  const items = menu.map(({ supplierNote, ...publicFields }) => publicFields);

  return (
    <>
      <h1 className="text-3xl font-bold">The menu</h1>
      <p className="mb-6 mt-2">Pick a category, then add what you'd like to your order.</p>
      <MenuBrowser items={items} />
    </>
  );
}
