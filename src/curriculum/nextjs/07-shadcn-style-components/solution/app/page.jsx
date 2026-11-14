import { Button } from '@/components/ui/button.jsx';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx';

export default function HomePage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Bread, baked before sunrise</h1>
      <p className="mb-6 mt-4">Skip the queue and collect your order on the way to work.</p>
      <Dialog>
        {/* asChild: the trigger behaviour lands on our Button instead of Radix adding its own button. */}
        <DialogTrigger asChild>
          <Button>Pre-order for pickup</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Pre-order for pickup</DialogTitle>
          <DialogDescription>Call us before 4pm the day before and we'll set it aside with your name on it.</DialogDescription>
          <p className="mt-4 font-medium">Phone: (02) 5550 0142</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
