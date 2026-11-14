import { Suspense } from 'react';
import Link from 'next/link';
import { getOvenStatus } from '@/lib/bakery-api.js';

// Live data: read at request time. It has to sit inside <Suspense> so the rest of the page can be sent straight away.
async function OvenStatus() {
  const { loavesLeft } = await getOvenStatus();
  return <p className="mt-4 rounded-lg bg-oat px-4 py-3">Loaves left today: {loavesLeft}</p>;
}

export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Bread, baked before sunrise</h1>
      <Suspense fallback={<p className="mt-4 rounded-lg bg-oat px-4 py-3">Checking the oven...</p>}>
        <OvenStatus />
      </Suspense>
      <Link href="/menu" className="mt-6 inline-block rounded-full bg-crust px-6 py-3 font-semibold text-cream">See the menu</Link>
    </>
  );
}
