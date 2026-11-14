import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4">That page has been eaten.</p>
      <Link href="/" className="mt-6 inline-block underline">
        Back to the home page
      </Link>
    </>
  );
}
