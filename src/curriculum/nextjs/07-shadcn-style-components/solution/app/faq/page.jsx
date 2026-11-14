import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion.jsx';
import { faqs } from '@/lib/faqs.js';

export const metadata = { title: 'FAQ' };

export default function FaqPage() {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">Questions we get asked</h1>
      <Accordion type="single" collapsible>
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
