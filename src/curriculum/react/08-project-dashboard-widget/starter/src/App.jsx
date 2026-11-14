import Dashboard from './components/Dashboard.jsx';

export default function App() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <h1 className="font-sans text-3xl font-semibold">Portfolio</h1>
      <Dashboard />
    </main>
  );
}
