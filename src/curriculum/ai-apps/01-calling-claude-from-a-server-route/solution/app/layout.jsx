import './globals.css';

export const metadata = { title: 'Harbour Hall: AI helpers', description: 'Small AI features for a small events venue.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
