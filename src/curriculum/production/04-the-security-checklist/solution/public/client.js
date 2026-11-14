// Runs in the visitor's browser. Whatever is in this file, the whole world can read.
// Only the anon key belongs here, because Row Level Security is what protects the data. The service role key never does.
const config = window.CONFIG;

export const headers = { apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` };
export const endpoint = `${config.url}/rest/v1/notes`;
