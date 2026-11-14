import TriageForm from '@/components/TriageForm.jsx';

export default function Home() {
  return (
    <>
      <h1>Enquiry triage</h1>
      <p className="lede">A cheap model sorts the enquiry, a better one writes the reply, and every call shows what it cost.</p>
      <TriageForm />
    </>
  );
}
