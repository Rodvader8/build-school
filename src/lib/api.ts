import type { LessonKind } from '../curriculum/types';

/** Every write or run request carries this header; the server refuses ones that don't (see server/api.ts). */
const HEADERS = { 'Content-Type': 'application/json', 'X-Build-School': '1' };

async function send(path: string, body: unknown) {
  const res = await fetch(path, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? res.statusText);
  return res.json();
}

export interface LessonFiles {
  files: Record<string, string> | null;
  /** Fonts and images: listed in the Explorer, served to the preview, not editable. */
  assets: string[];
  folder?: string;
}

export async function loadFiles(lesson: string): Promise<LessonFiles> {
  const res = await fetch(`/api/files?lesson=${encodeURIComponent(lesson)}`);
  return res.json();
}

/** Copies the lesson's starter folder into the workspace. replace = start over. */
export const seedLesson = (lesson: string, replace = false): Promise<LessonFiles> => send('/api/seed', { lesson, replace });

export const saveFiles = (lesson: string, files: Record<string, string>, replace = false): Promise<{ folder: string }> =>
  send('/api/files', { lesson, files, replace });

export async function loadProgress(): Promise<string[]> {
  const res = await fetch('/api/progress');
  return (await res.json()).done ?? [];
}

export const saveProgress = (done: string[]) => send('/api/progress', { done });

export const sendStdin = (text: string) => send('/api/stdin', { text });

export const stopRun = () => send('/api/stop', {});

/** Runs a Python or Rust lesson and streams its output into onChunk. Resolves with the full output. */
export interface RunOptions {
  /** Text piped into the program's input, then closed (used when checking work). */
  stdin?: string;
  /** Rust: run `cargo test` instead of `cargo run`. */
  test?: boolean;
}

export async function runProgram(lesson: string, kind: LessonKind, entry: string, onChunk: (text: string) => void, options: RunOptions = {}) {
  const res = await fetch('/api/run', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ lesson, kind, entry, ...options }),
  });
  if (!res.body) throw new Error('no output stream');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let all = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    all += text;
    onChunk(text);
  }
  return all;
}

/** Where the terminal is for this lesson, and the workspace root (to show a short prompt). */
export async function shellInfo(lesson: string): Promise<{ cwd: string; workspace: string }> {
  const res = await fetch(`/api/shell?lesson=${encodeURIComponent(lesson)}`);
  return res.json();
}

/** Runs a shell command in the lesson's terminal. Streams output; reports the folder it ended in. */
export async function runShell(lesson: string, command: string, onChunk: (text: string) => void, onCwd: (cwd: string) => void) {
  const res = await fetch('/api/shell', { method: 'POST', headers: HEADERS, body: JSON.stringify({ lesson, command }) });
  if (!res.ok || !res.body) {
    onChunk(`${(await res.json().catch(() => ({}))).error ?? res.statusText}\n`);
    return;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let held = ''; // the end marker might arrive split across chunks
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    held += decoder.decode(value, { stream: true });
    const marker = held.indexOf('\u0000');
    if (marker === -1) {
      onChunk(held);
      held = '';
    } else {
      if (marker > 0) onChunk(held.slice(0, marker));
      held = held.slice(marker);
    }
  }
  const match = /\u0000CWD:(.*)$/s.exec(held);
  if (match) onCwd(match[1].trim());
  else if (held) onChunk(held);
}

/** Starts or stops a project lesson's dev server. */
export const devServer = (lesson: string, action: 'start' | 'stop', command?: string) => send('/api/dev', { lesson, action, command });

/** Whether the lesson's dev server is running, and its recent log lines. */
export async function devStatus(lesson: string, port: number): Promise<{ running: boolean; log: string[] }> {
  const res = await fetch(`/api/dev?lesson=${encodeURIComponent(lesson)}&port=${port}`);
  return res.json();
}
