import Image from 'next/image';

const photos = [
  { src: '/images/loaf-1.jpg', alt: 'A country sourdough with a deep golden crust' },
  { src: '/images/loaf-2.jpg', alt: 'A rosemary focaccia fresh from the tray' },
];

// Below the fold, so these keep the default: they load lazily, only when scrolled near.
export default function Gallery() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2">
      {photos.map((photo) => (
        <li key={photo.src}>
          <Image src={photo.src} alt={photo.alt} width={800} height={600} sizes="(min-width: 640px) 50vw, 100vw" className="h-auto w-full rounded-xl" />
        </li>
      ))}
    </ul>
  );
}
