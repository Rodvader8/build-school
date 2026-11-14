import { PGlite } from '@electric-sql/pglite';
import { readdirSync, readFileSync } from 'node:fs';

const dir = (path) => new URL(`../db/${path}`, import.meta.url);

/** Runs every file in db/migrations in name order (001, 002...). */
export async function migrate(db) {
  const files = readdirSync(dir('migrations')).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) await db.exec(readFileSync(dir(`migrations/${file}`), 'utf8'));
}

/**
 * A real Postgres, running inside this process (PGlite is Postgres compiled to WebAssembly). It lives in memory,
 * so every call starts clean: no account, no Docker, no network. Supabase is Postgres too, so the SQL you write
 * here is the SQL you'd run there.
 */
export async function openDb({ seed = false } = {}) {
  const db = new PGlite();
  await migrate(db);
  if (seed) await db.exec(readFileSync(dir('seed.sql'), 'utf8'));
  return db;
}
