'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils.js';

// Radix does the hard part: keyboard support, aria-expanded, one-at-a-time. These wrappers only add classes.
const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }) {
  return <AccordionPrimitive.Item className={cn('border-b border-oat', className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-left font-medium hover:underline focus-visible:outline-2 focus-visible:outline-crust [&[data-state=open]>span]:rotate-45',
          className,
        )}
        {...props}
      >
        {children}
        <span aria-hidden="true" className="text-xl transition-transform motion-reduce:transition-none">+</span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content className="overflow-hidden text-sm" {...props}>
      <div className={cn('pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
