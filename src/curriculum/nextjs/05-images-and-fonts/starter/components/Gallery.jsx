const photos = [
  { src: '/images/loaf-1.jpg', alt: 'A country sourdough with a deep golden crust' },
  { src: '/images/loaf-2.jpg', alt: 'A rosemary focaccia fresh from the tray' },
];

// TODO: use next/image here too (800 by 600), and leave out preload: these are below the fold.
export default function Gallery() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2">
      {photos.map((photo) => (
        <li key={photo.src}>
          <img src={photo.src} alt={photo.alt} className="h-auto w-full rounded-xl" />
        </li>
      ))}
    </ul>
  );
}
