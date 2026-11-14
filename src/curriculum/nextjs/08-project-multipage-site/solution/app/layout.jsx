import Link from 'next/link';
import localFont from 'next/font/local';
import './globals.css';
import { SITE_URL, SITE_NAME } from '@/lib/site.js';

const instrument = localFont({ src: './fonts/instrument-serif-latin-400-normal.woff2', weight: '400', display: 'swap', variable: '--font-instrument' });
const geist = localFont({ src: './fonts/geist-latin-wght-normal.woff2', weight: '100 900', display: 'swap', variable: '--font-geist' });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Learn to surf`, template: '%s | Ironbark Surf School' },
  description: 'Small-group surf lessons for beginners to improvers, on a patrolled beach.',
  alternates: { canonical: './' },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Warm sunrise colours over the water' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${instrument.variable} ${geist.variable}`}>
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-foam">
          <nav aria-label="Main" className="mx-auto flex max-w-4xl items-center gap-6 px-6 py-4">
            <Link href="/" className="mr-auto font-display text-2xl text-sea-dark">Ironbark</Link>
            <Link href="/lessons">Lessons</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">{children}</main>
        <footer className="border-t border-foam px-6 py-6 text-center text-sm">Lessons run daily, tide and weather permitting.</footer>
      </body>
    </html>
  );
}
