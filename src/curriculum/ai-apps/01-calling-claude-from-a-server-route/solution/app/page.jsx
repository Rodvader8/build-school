import AskForm from '@/components/AskForm.jsx';

export default function Home() {
  return (
    <>
      <h1>Harbour Hall assistant</h1>
      <p className="lede">A small question box. The browser talks to our own /api/ask, and only the server talks to Claude.</p>
      <AskForm />
    </>
  );
}
