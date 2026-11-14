import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1 className="font-display text-4xl text-sea-dark">Page not found</h1>
      <p className="mt-4">That wave has passed.</p>
      <Link href="/" className="mt-6 inline-block underline">Back to the home page</Link>
    </>
  );
}
