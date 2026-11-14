// TODO: swap the plain <img> for next/image with width, height, sizes and preload.
export default function Hero() {
  return (
    <section>
      <h1 className="font-display text-5xl">Bread, baked before sunrise</h1>
      <img src="/images/hero.jpg" alt="Loaves cooling on a wooden rack in warm morning light" className="mt-6 h-auto w-full rounded-2xl" />
    </section>
  );
}
