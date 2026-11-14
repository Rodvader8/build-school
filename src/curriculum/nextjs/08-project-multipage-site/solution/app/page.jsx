import Image from 'next/image';
import Link from 'next/link';
import { faqs } from '@/lib/data.js';

const reasons = [
  { title: 'Small groups', text: 'Never more than six surfers per coach.' },
  { title: 'Gear included', text: 'Boards, wetsuits and rash vests, sized to you.' },
  { title: 'Patrolled beach', text: 'Lifeguards on duty for every session.' },
];

export default function HomePage() {
  return (
    <>
      <h1 className="font-display text-5xl text-sea-dark">Learn to surf, properly</h1>
      <p className="mt-3 max-w-xl text-lg">Friendly coaches, small groups and a beach that's gentle on beginners.</p>
      <Image
        src="/images/hero.jpg"
        alt="Warm sunrise colours over the water"
        width={1600}
        height={900}
        sizes="(min-width: 896px) 896px, 100vw"
        preload
        className="mt-8 h-auto w-full rounded-2xl"
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {reasons.map((reason) => (
          <li key={reason.title} className="rounded-xl bg-foam p-5">
            <h2 className="font-semibold text-sea-dark">{reason.title}</h2>
            <p className="mt-1 text-sm">{reason.text}</p>
          </li>
        ))}
      </ul>
      <Link href="/lessons" className="mt-8 inline-block rounded-full bg-sea px-6 py-3 font-semibold text-sand hover:bg-sea-dark">See the lessons</Link>
      <section aria-labelledby="faq-heading" className="mt-14">
        <h2 id="faq-heading" className="font-display text-3xl text-sea-dark">Before you book</h2>
        {faqs.map((faq) => (
          <details key={faq.question} className="border-b border-foam py-3">
            <summary className="cursor-pointer font-medium">{faq.question}</summary>
            <p className="mt-2 text-sm">{faq.answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
