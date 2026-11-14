import './globals.css';

export const metadata = {
  title: 'Fennel & Co Bakehouse',
  description: 'Small-batch bread and pastry, baked before sunrise.',
};

// TODO: the root layout needs lang="en", a header with a nav, a <main> and a footer.
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
