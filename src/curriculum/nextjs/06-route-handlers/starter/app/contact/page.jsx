import EnquiryForm from '@/components/EnquiryForm.jsx';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Send an enquiry</h1>
      <p className="mb-6 mt-2">We reply within a day.</p>
      <EnquiryForm />
    </>
  );
}
