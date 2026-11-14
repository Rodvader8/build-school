import localFont from 'next/font/local';
import './globals.css';

// next/font/local reads the committed file, hashes it, serves it from your own site and preloads it.
// Nothing is fetched from Google, at build time or by the visitor.
const instrument = localFont({
  src: './fonts/instrument-serif-latin-400-normal.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-instrument',
});

const geist = localFont({
  src: './fonts/geist-latin-wght-normal.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-geist',
});

export const metadata = { title: 'Fennel & Co Bakehouse', description: 'Small-batch bread and pastry.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${instrument.variable} ${geist.variable}`}>
      <body>
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
