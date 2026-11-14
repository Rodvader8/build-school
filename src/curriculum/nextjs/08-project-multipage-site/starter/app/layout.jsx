import './globals.css';

// TODO: load both fonts from app/fonts with next/font/local (variables --font-instrument and --font-geist),
// add the site metadata (metadataBase, title template, description, canonical, Open Graph image),
// and wrap the pages in a header nav (Home, Lessons, Contact), a <main> and a footer.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
