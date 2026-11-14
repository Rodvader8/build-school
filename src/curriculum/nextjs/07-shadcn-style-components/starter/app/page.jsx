import { Button } from '@/components/ui/button.jsx';

// TODO: wrap this in a Dialog from components/ui/dialog.jsx. The Button becomes the DialogTrigger (use asChild),
// and the content has a title "Pre-order for pickup", a description and the phone number.
export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Bread, baked before sunrise</h1>
      <p className="mb-6 mt-4">Skip the queue and collect your order on the way to work.</p>
      <Button>Pre-order for pickup</Button>
    </>
  );
}
