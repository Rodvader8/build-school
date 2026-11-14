import Image from 'next/image';

export default function Hero() {
  return (
    <section>
      <h1 className="font-display text-5xl">Bread, baked before sunrise</h1>
      {/* The hero is the biggest thing on screen, so load it first: preload, and say how wide it will really be. */}
      <Image
        src="/images/hero.jpg"
        alt="Loaves cooling on a wooden rack in warm morning light"
        width={1600}
        height={900}
        sizes="(min-width: 896px) 896px, 100vw"
        preload
        className="mt-6 h-auto w-full rounded-2xl"
      />
    </section>
  );
}
