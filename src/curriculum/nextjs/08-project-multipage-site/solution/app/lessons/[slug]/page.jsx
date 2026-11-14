import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lessons } from '@/lib/data.js';

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return { title: 'Lesson not found' };
  return { title: lesson.name, description: `${lesson.name} (${lesson.level}), ${lesson.duration}. ${lesson.blurb}` };
}

export default async function LessonPage({ params }) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) notFound();

  return (
    <article>
      <p className="text-sm uppercase tracking-wide text-sea">{lesson.level}</p>
      <h1 className="font-display text-4xl text-sea-dark">{lesson.name}</h1>
      <p className="mt-4 max-w-xl text-lg">{lesson.blurb}</p>
      <p className="mt-4 font-medium">
        ${lesson.price} per person / {lesson.duration}
      </p>
      <Link href="/contact" className="mt-6 inline-block rounded-full bg-sea px-6 py-3 font-semibold text-sand hover:bg-sea-dark">Book this lesson</Link>
    </article>
  );
}
