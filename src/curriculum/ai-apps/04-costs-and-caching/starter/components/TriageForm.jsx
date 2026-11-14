'use client';

import { useState } from 'react';

const dollars = (n) => `$${n.toFixed(5)}`;

export default function TriageForm() {
  const [status, setStatus] = useState('idle'); // idle | working | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    const enquiry = new FormData(event.currentTarget).get('enquiry');
    setStatus('working');
    const response = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enquiry }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error ?? 'Something went wrong.');
      return setStatus('error');
    }
    setResult(data);
    setStatus('done');
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="enquiry">Paste an enquiry</label>
        <textarea id="enquiry" name="enquiry" rows={4} defaultValue="Hi, we're getting married in March and think about 50 guests. Do you do grazing tables?" />
        <button type="submit" disabled={status === 'working'}>{status === 'working' ? 'Working...' : 'Draft a reply'}</button>
      </form>
      {status === 'error' && <p role="alert" className="error">{error}</p>}
      {status === 'done' && (
        <div role="status" className="result">
          <p className="meta">Category: {result.category}</p>
          <p>{result.reply}</p>
          <table>
            <tbody>
              {Object.entries(result.usage).map(([step, u]) => (
                <tr key={step}>
                  <th scope="row">{step}</th>
                  <td>{u.model}</td>
                  <td>{u.inputTokens} in, {u.outputTokens} out, {u.cacheReadTokens} cached</td>
                  <td>{dollars(u.usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="meta">This enquiry cost {dollars(result.totalUsd)}</p>
        </div>
      )}
    </>
  );
}
