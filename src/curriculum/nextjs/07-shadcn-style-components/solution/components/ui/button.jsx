import { cn } from '@/lib/utils.js';

// A plain styled button. It has no state, so it doesn't need "use client".
export function Button({ className, ...props }) {
  return (
    <button
      type="button"
      className={cn('rounded-full bg-crust px-6 py-3 font-semibold text-cream hover:bg-crust-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crust', className)}
      {...props}
    />
  );
}
