import Link from 'next/link';
import './globals.css';
import { SITE_URL, SITE_NAME } from '@/lib/site.js';

export const metadata = {
  // Relative URLs in metadata (the og image, canonical links) are resolved against this.
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: '%s | Fennel & Co' },
  description: 'Small-batch bread and pastry, baked before sunrise.',
  alternates: { canonical: './' },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'A warm loaf of bread on a bakery counter' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav aria-label="Main" className="mx-auto flex max-w-3xl gap-6 border-b border-oat px-6 py-4">
          <Link href="/" className="mr-auto font-bold text-crust-dark">Fennel &amp; Co</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/about">About</Link>
        </nav>
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
