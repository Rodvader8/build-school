import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// The helper every shadcn-style component uses: join class names, then let the last Tailwind utility win.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
