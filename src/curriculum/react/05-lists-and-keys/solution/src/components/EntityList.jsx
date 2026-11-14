import { useState } from 'react';
import { money } from '../format.js';

export default function EntityList({ entities }) {
  const [query, setQuery] = useState('');
  const [reversed, setReversed] = useState(false);

  const matches = entities.filter((e) => e.name.toLowerCase().includes(query.trim().toLowerCase()));
  const shown = reversed ? [...matches].reverse() : matches;

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

      {shown.length === 0 && <p className="muted">No entities match "{query}"</p>}
      <ul className="list">
        {shown.map((entity) => (
          <li key={entity.id}>
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
