import { fingerprint } from './fingerprint.js';

/**
 * Wraps a request handler. If it throws or rejects, the error is reported with scrubbed request details and the
 * visitor gets a plain 500 that says nothing about the code: no message, no stack.
 */
export function wrapHandler(handler, { reporter }) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      reporter.report(error, { type: 'server', url: req.url, method: req.method, headers: req.headers });
      if (res.headersSent) return res.end();
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Something went wrong', reference: fingerprint(error instanceof Error ? error : new Error(String(error))) }));
    }
  };
}

/** Reports crashes nobody caught. proc is the Node process (or anything with .on). */
export function installProcessHandlers(proc, reporter) {
  proc.on('uncaughtException', (error) => reporter.report(error, { type: 'uncaughtException' }));
  proc.on('unhandledRejection', (reason) => reporter.report(reason, { type: 'unhandledRejection' }));
}
