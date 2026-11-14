'use client';

import { useState } from 'react';

export default function PackForm() {
  const [status, setStatus] = useState('idle'); // idle | building | done | error
  const [message, setMessage] = useState('');

  async function download(format) {
    const brief = document.getElementById('brief').value;
    setStatus('building');
    const response = await fetch('/api/pack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief, format }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error ?? 'Something went wrong.');
      return setStatus('error');
    }
    // The server sends the file's bytes. Turn them into a temporary link and click it.
    const name = /filename="([^"]+)"/.exec(response.headers.get('Content-Disposition') ?? '')?.[1] ?? `plan.${format}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(await response.blob());
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
    setMessage(`Downloaded ${name}`);
    setStatus('done');
  }

  return (
    <>
      <label htmlFor="brief">Describe the event</label>
      <textarea id="brief" rows={4} defaultValue="A garden party for 40 on Saturday afternoon, light food, speeches at five." />
      <div className="actions">
        <button type="button" disabled={status === 'building'} onClick={() => download('docx')}>Word document</button>
        <button type="button" disabled={status === 'building'} onClick={() => download('xlsx')}>Spreadsheet</button>
      </div>
      {status === 'error' && <p role="alert" className="error">{message}</p>}
      {status === 'done' && <p role="status" className="result">{message}</p>}
    </>
  );
}
