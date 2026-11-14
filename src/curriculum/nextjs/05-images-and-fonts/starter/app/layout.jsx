import './globals.css';

// TODO: load the two committed fonts in app/fonts with next/font/local (variables --font-instrument and
// --font-geist) and put both variable classes on <html>.
export const metadata = { title: 'Fennel & Co Bakehouse', description: 'Small-batch bread and pastry.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
