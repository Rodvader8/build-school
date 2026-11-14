import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Fennel & Co Bakehouse',
  description: 'Small-batch bread and pastry, baked before sunrise.',
};

// The root layout wraps every page. It must contain <html> and <body>.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-oat">
          <nav aria-label="Main" className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4">
            <Link href="/" className="mr-auto font-bold text-crust-dark">
              Fennel &amp; Co
            </Link>
            <Link href="/menu">Menu</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">{children}</main>
        <footer className="border-t border-oat px-6 py-6 text-center text-sm text-crust-dark">Open Tuesday to Sunday, 6am to 2pm.</footer>
      </body>
    </html>
  );
}
