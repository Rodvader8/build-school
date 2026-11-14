import Link from 'next/link';
import { getOvenStatus } from '@/lib/bakery-api.js';

// TODO: this live read blocks the whole page, and the build will say so.
// Move it into its own component and wrap that in <Suspense> with a fallback.
export default async function HomePage() {
  const { loavesLeft } = await getOvenStatus();

  return (
    <>
      <h1 className="text-4xl font-bold">Bread, baked before sunrise</h1>
      <p className="mt-4 rounded-lg bg-oat px-4 py-3">Loaves left today: {loavesLeft}</p>
      <Link href="/menu" className="mt-6 inline-block rounded-full bg-crust px-6 py-3 font-semibold text-cream">See the menu</Link>
    </>
  );
}
