import Link from 'next/link';
import './globals.css';

// TODO: this is the bare minimum. Add metadataBase, a title template, alternates.canonical and openGraph.images.
export const metadata = {
  title: 'Fennel & Co Bakehouse',
  description: 'Small-batch bread and pastry, baked before sunrise.',
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
