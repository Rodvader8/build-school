import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { cn } from '../lib/utils.js';
import { faqs } from '../lib/faqs.js';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion.jsx';

const load = (path) => import(path);

describe('the cn helper', () => {
  it('cn joins class names and drops falsy ones', () => {
    expect(cn('a', false && 'b', undefined, { c: true, d: false }, ['e'])).toBe('a c e');
  });

  it('cn lets the last Tailwind utility win', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });
});

describe('the accordion', () => {
  const setup = () =>
    render(
      <Accordion type="single" collapsible>
        {['One', 'Two'].map((q) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger>{q}?</AccordionTrigger>
            <AccordionContent>Answer {q}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>,
    );

  it('opens one answer at a time', async () => {
    const user = userEvent.setup();
    setup();
    const one = screen.getByRole('button', { name: /One\?/ });
    const two = screen.getByRole('button', { name: /Two\?/ });
    expect(one.getAttribute('aria-expanded')).toBe('false');
    await user.click(one);
    expect(one.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Answer One')).toBeTruthy();
    await user.click(two);
    expect(one.getAttribute('aria-expanded')).toBe('false');
    expect(two.getAttribute('aria-expanded')).toBe('true');
  });

  it('can be used from the keyboard', async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /One\?/ }).getAttribute('aria-expanded')).toBe('true');
  });

  it('the FAQ page has one trigger per question', async () => {
    const { default: FaqPage } = await load('../app/faq/page.jsx');
    render(<FaqPage />);
    const names = screen.getAllByRole('button').map((b) => b.textContent.replace('+', ''));
    expect(names).toEqual(faqs.map((f) => f.question));
  });
});

describe('the dialog', () => {
  const setup = async () => {
    const { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } = await load('../components/ui/dialog.jsx');
    return render(
      <Dialog>
        <DialogTrigger>Open it</DialogTrigger>
        <DialogContent>
          <DialogTitle>Pre-order</DialogTitle>
          <DialogDescription>Call us first.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
  };

  it('opens from its trigger with a title and a description', async () => {
    const user = userEvent.setup();
    await setup();
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open it' }));
    const dialog = screen.getByRole('dialog', { name: 'Pre-order' });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByText('Call us first.')).toBeTruthy();
  });

  it('has a close button, and Escape closes it and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    await setup();
    const trigger = screen.getByRole('button', { name: 'Open it' });
    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
