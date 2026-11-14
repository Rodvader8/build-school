import './globals.css';

export const metadata = { title: 'Fennel & Co Bakehouse', description: 'Small-batch bread and pastry.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
