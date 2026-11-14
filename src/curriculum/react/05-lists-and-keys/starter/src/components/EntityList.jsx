import { useState } from 'react';
import { money } from '../format.js';

export default function EntityList({ entities }) {
  const [query, setQuery] = useState('');
  const [reversed, setReversed] = useState(false);

  // Step 1: filter by name (ignore capitals) and, when reversed is true, flip the order.
  // Never change `entities` itself: it belongs to the parent.
  const shown = entities;

  return (
    <section className="card">
      <h2>Entities</h2>
      <div className="field">
        <label htmlFor="filter">Filter</label>
        <input id="filter" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <p>
        <button type="button" className="btn" onClick={() => setReversed(!reversed)}>
          Reverse order
        </button>
      </p>

      {/* Step 3: when nothing matches, show: No entities match "zzz" */}
      <ul className="list">
        {shown.map((entity, index) => (
          // Step 2: the key tells React which row is which. An index is not an identity.
          <li key={index}>
            <span>
              {entity.name} <span className="muted">{entity.type}</span>
            </span>
            <span>{money(entity.value)}</span>
            <input aria-label={`Note for ${entity.name}`} placeholder="Note" />
          </li>
        ))}
      </ul>
    </section>
  );
}
