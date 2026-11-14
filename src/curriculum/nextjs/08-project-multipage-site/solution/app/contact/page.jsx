import EnquiryForm from '@/components/EnquiryForm.jsx';

export const metadata = {
  title: 'Contact',
  description: 'Ask about a lesson, a group booking or a birthday party on the beach.',
};

export default function ContactPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl text-sea-dark">Get in touch</h1>
      <p className="mb-6 mt-2">Tell us what you're after and we'll reply within a day.</p>
      <EnquiryForm />
    </div>
  );
}
