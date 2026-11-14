import PackForm from '@/components/PackForm.jsx';

export default function Home() {
  return (
    <>
      <h1>Event pack</h1>
      <p className="lede">One brief in, a Word document or a spreadsheet out. Claude writes the plan, our code builds the files.</p>
      <PackForm />
    </>
  );
}
