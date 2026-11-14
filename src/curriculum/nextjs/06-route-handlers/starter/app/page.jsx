import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Fennel &amp; Co Bakehouse</h1>
      <p className="mt-4">Planning a party or a wedding? Tell us what you need.</p>
      <Link href="/contact" className="mt-6 inline-block rounded-full bg-crust px-6 py-3 font-semibold text-cream">Send an enquiry</Link>
    </>
  );
}
