'use client';

import { useState } from 'react';

const field = 'mt-1 w-full rounded-lg border border-crust bg-white px-3 py-2';

export default function EnquiryForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

  async function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('sending');
    setErrors({});
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    if (response.ok) return setStatus('sent');
    const data = await response.json().catch(() => ({}));
    setErrors(data.errors ?? {});
    setStatus('error');
  }

  if (status === 'sent') return <p role="status" className="rounded-lg bg-oat p-4">Thanks! We'll be in touch soon.</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" autoComplete="name" className={field} aria-describedby="name-error" />
        {errors.name && <p id="name-error" role="alert" className="text-sm text-red-700">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" className={field} aria-describedby="email-error" />
        {errors.email && <p id="email-error" role="alert" className="text-sm text-red-700">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="message">What do you need?</label>
        <textarea id="message" name="message" rows={4} className={field} aria-describedby="message-error" />
        {errors.message && <p id="message-error" role="alert" className="text-sm text-red-700">{errors.message}</p>}
      </div>
      {/* Honeypot: pushed off-screen and hidden from keyboards and screen readers. People never fill it in, bots often do. */}
      <div aria-hidden="true" className="absolute -left-2500">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={status === 'sending'} className="rounded-full bg-crust px-6 py-3 font-semibold text-cream disabled:opacity-60">
        {status === 'sending' ? 'Sending...' : 'Send enquiry'}
      </button>
      {status === 'error' && !Object.keys(errors).length && <p role="alert">Something went wrong. Please try again.</p>}
    </form>
  );
}
