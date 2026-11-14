import { fingerprint } from './fingerprint.js';

/**
 * Wraps a request handler. If it throws or rejects: report the error with context { type: 'server', url: req.url,
 * method: req.method, headers: req.headers }, then (unless headers are already sent) answer 500 with the JSON
 * { error: 'Something went wrong', reference: <the fingerprint> }. The visitor never sees the message or the stack.
 */
export function wrapHandler(handler, { reporter }) {
  return async (req, res) => {
    // TODO
    await handler(req, res);
  };
}

/** Reports crashes nobody caught: proc.on('uncaughtException') and proc.on('unhandledRejection'),
 *  with context types 'uncaughtException' and 'unhandledRejection'. */
export function installProcessHandlers(proc, reporter) {
  // TODO
}
