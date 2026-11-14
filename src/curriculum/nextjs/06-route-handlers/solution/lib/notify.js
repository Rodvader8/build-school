// Passes an enquiry on to the owner. Where it goes is a secret, so it comes from the environment.
export async function sendEnquiry(values) {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return { sent: false };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: `New enquiry from ${values.name} (${values.email}): ${values.message}` }),
  });
  return { sent: response.ok };
}
