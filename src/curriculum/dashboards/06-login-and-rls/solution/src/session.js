// "Acting as" a user, the way Supabase does it for each request: switch to the 'authenticated' database role, and
// put the user's token claims where auth.uid() looks for them. Both last for one transaction only, then everything resets.

/** Runs fn(tx) as a signed-in user. Queries inside it are subject to row-level security. */
export function asUser(db, userId, fn) {
  return db.transaction(async (tx) => {
    await tx.exec('set local role authenticated');
    await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: userId, role: 'authenticated' })]);
    return fn(tx);
  });
}

/** Runs fn(tx) as a visitor who hasn't logged in. */
export function asAnon(db, fn) {
  return db.transaction(async (tx) => {
    await tx.exec('set local role anon');
    return fn(tx);
  });
}
