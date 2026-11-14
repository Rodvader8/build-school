import Link from 'next/link';

// No state, no events: a server component, which is the default.
export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Bread, baked before sunrise</h1>
      <Link href="/menu" className="mt-6 inline-block rounded-full bg-crust px-6 py-3 font-semibold text-cream">See the menu</Link>
    </>
  );
}
