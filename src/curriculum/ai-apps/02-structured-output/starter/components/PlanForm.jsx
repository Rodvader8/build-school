'use client';

import { useState } from 'react';

export default function PlanForm() {
  const [status, setStatus] = useState('idle'); // idle | planning | done | error
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    const brief = new FormData(event.currentTarget).get('brief');
    setStatus('planning');
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error ?? 'Something went wrong.');
      return setStatus('error');
    }
    setPlan(data.plan);
    setStatus('done');
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="brief">Describe the event</label>
        <textarea id="brief" name="brief" rows={4} defaultValue="A garden party for 40 on Saturday afternoon, light food, speeches at five." />
        <button type="submit" disabled={status === 'planning'}>{status === 'planning' ? 'Planning...' : 'Plan it'}</button>
      </form>
      {status === 'error' && <p role="alert" className="error">{error}</p>}
      {status === 'done' && (
        <div role="status" className="result">
          <h2>{plan.title}</h2>
          <p className="meta">{plan.venue}, {plan.guests} guests</p>
          <table>
            <tbody>
              {plan.schedule.map((row) => (
                <tr key={row.time + row.activity}><th scope="row">{row.time}</th><td>{row.activity}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="meta">{plan.notes}</p>
        </div>
      )}
    </>
  );
}
