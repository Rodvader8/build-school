// Passes an enquiry on to the owner.
// TODO: this address is a secret, and secrets never go in code. Read it from process.env.ENQUIRY_WEBHOOK_URL,
// and return { sent: false } without calling fetch when it isn't set.
const WEBHOOK = 'https://hooks.example.invalid/enquiries/FAKE-TOKEN-1234';

export async function sendEnquiry(values) {
  const response = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: `New enquiry from ${values.name} (${values.email}): ${values.message}` }),
  });
  return { sent: response.ok };
}
