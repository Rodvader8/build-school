import { SITE_URL, SITE_NAME } from '@/lib/site.js';

// Structured data: tells search engines what kind of business this is.
const bakery = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: SITE_NAME,
  url: SITE_URL,
  openingHours: 'Tu-Su 06:00-14:00',
};

export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Bread, baked before sunrise</h1>
      <p className="mt-4 text-lg">Small-batch loaves and pastries, made fresh every morning.</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bakery).replace(/</g, '\\u003c') }} />
    </>
  );
}
