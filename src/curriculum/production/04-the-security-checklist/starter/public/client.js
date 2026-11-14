// Runs in the visitor's browser. Whatever is in this file, the whole world can read.
const config = window.CONFIG;

export const headers = { apikey: config.serviceRoleKey, Authorization: `Bearer ${config.serviceRoleKey}` };
export const endpoint = `${config.url}/rest/v1/notes`;
