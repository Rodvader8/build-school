import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// The helper every shadcn-style component uses: join class names, then let the last Tailwind utility win.
// TODO: clsx joins names and drops false values; twMerge resolves clashes like "px-2 px-4". Use both.
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
