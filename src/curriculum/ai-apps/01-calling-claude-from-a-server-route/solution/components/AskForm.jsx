'use client';

import { useState } from 'react';

export default function AskForm() {
  const [status, setStatus] = useState('idle'); // idle | asking | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    const question = new FormData(event.currentTarget).get('question');
    setStatus('asking');
    setError('');
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
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
        <label htmlFor="question">Ask the venue assistant</label>
        <textarea id="question" name="question" rows={3} placeholder="Can we bring our own cake?" />
        <button type="submit" disabled={status === 'asking'}>{status === 'asking' ? 'Asking...' : 'Ask'}</button>
      </form>
      {status === 'error' && <p role="alert" className="error">{error}</p>}
      {status === 'done' && (
        <div role="status" className="result">
          <p>{result.answer}</p>
          <p className="meta">{result.usage.inputTokens} tokens in, {result.usage.outputTokens} tokens out</p>
        </div>
      )}
    </>
  );
}
