import { useState } from 'react';
import EntityForm from './components/EntityForm.jsx';

export default function App() {
  const [added, setAdded] = useState(null);

  return (
    <div className="page">
      <h1>Add an entity</h1>
      <EntityForm onAdd={setAdded} />
      {added && (
        <p className="card" role="status">
          Added {added.name} at ${added.value.toLocaleString('en-AU')}.
        </p>
      )}
    </div>
  );
}
