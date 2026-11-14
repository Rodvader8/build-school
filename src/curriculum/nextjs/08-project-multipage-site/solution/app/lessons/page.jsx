import Image from 'next/image';
import Link from 'next/link';
import { lessons } from '@/lib/data.js';

export const metadata = {
  title: 'Lessons',
  description: 'Beginner, improver and kids surf lessons, with all the gear included.',
};

export default function LessonsPage() {
  return (
    <>
      <h1 className="font-display text-4xl text-sea-dark">Our lessons</h1>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug} className="overflow-hidden rounded-2xl bg-foam">
            <Image src={`/images/lesson-${(i % 2) + 1}.jpg`} alt="" width={800} height={600} sizes="(min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
            <div className="p-5">
              <h2 className="text-xl font-semibold">
                <Link href={`/lessons/${lesson.slug}`} className="underline-offset-4 hover:underline">{lesson.name}</Link>
              </h2>
              <p className="text-sm">{lesson.level} / ${lesson.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
