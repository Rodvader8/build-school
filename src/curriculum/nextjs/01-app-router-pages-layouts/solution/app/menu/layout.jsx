// A nested layout: it wraps /menu and everything below it, inside the root layout.
export default function MenuLayout({ children }) {
  return (
    <section>
      <p className="mb-6 rounded-lg bg-oat px-4 py-3 text-sm">Baked fresh every morning from 5am. Sold out means sold out.</p>
      {children}
    </section>
  );
}
