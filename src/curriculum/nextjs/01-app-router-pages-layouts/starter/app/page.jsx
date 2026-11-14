import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Bread, baked before sunrise</h1>
      <p className="mt-4 text-lg">Small-batch loaves and pastries, made in the back of the shop every morning.</p>
      <Link href="/menu" className="mt-8 inline-block rounded-full bg-crust px-6 py-3 font-semibold text-cream">
        See the menu
      </Link>
    </>
  );
}
