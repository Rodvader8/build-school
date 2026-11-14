# Errors

nudge treats a call as failed only when your function **throws** or its promise **rejects**.

If your function returns a value, even `null`, `false` or an error object, that's a success and nudge returns it.

## Which failures are retried

By default, every thrown error is retried until `attempts` runs out. To retry only some, pass `retryIf`:

```js
await retry(fetchReport, {
  attempts: 3,
  retryIf: (error) => error.code === 'ETIMEDOUT',
});
```

When `retryIf` returns `false`, nudge stops at once and throws that same error. It doesn't wrap it, and it doesn't use up the remaining attempts.

## When attempts run out

After the last attempt, nudge throws the error from that last attempt, unchanged.
