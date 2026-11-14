/**
 * web: HTML/CSS/JS served from the workspace, checked in the preview.
 * python / rust: programs run in the terminal, checked from their output.
 * terminal: shell lessons (Git, the command line), checked by a Python script (checkEntry).
 * node: JavaScript or TypeScript run with Node, checked from output.
 * project: a full npm project with its own dev server (devCommand, devPort), checked by a Node script (checkEntry).
 */
export type LessonKind = 'web' | 'python' | 'rust' | 'terminal' | 'node' | 'project';

export interface CheckContext {
  /** The rendered preview page (web lessons). */
  doc: Document;
  /** The preview's window, for computed styles: win.getComputedStyle(el). */
  win: Window;
  /** The student's files, exactly as typed. */
  files: Record<string, string>;
  /** Terminal output from the last run (Python and Rust lessons). */
  output: string;
}

export interface Check {
  label: string;
  /** Checks run in order and may be async (to wait for a fetch, an animation or a reload). */
  test: (ctx: CheckContext) => boolean | Promise<boolean>;
}

/** What each lesson.ts exports as default. */
export interface LessonMeta {
  title: string;
  minutes: number;
  kind: LessonKind;
  /** The file opened first in the editor. */
  entry: string;
  /** The page shown in the preview (web lessons). Defaults to index.html. */
  page?: string;
  /** Python: the file run by Check my work (e.g. a visible tests.py). Defaults to entry. */
  checkEntry?: string;
  /** Python and Rust: text fed to the program's input when checking, so input() gets answers. */
  stdin?: string;
  /** Rust: Check my work runs `cargo test` instead of `cargo run`. */
  cargoTest?: boolean;
  /** Automated tests only: a shell command run in the throwaway copy first (e.g. create a venv). */
  testSetup?: string;
  /** project lessons: the command that starts the dev server (default "npm run dev"). */
  devCommand?: string;
  /** project lessons: the port the dev server listens on; the preview shows http://localhost:<devPort>/. */
  devPort?: number;
  checks: Check[];
  hints: string[];
  realWorld?: { label: string; href: string };
}

export interface Lesson extends LessonMeta {
  id: string;
  trackId: string;
  order: number;
  body: string;
  starter: Record<string, string>;
  solution: Record<string, string>;
}

export interface Track {
  id: string;
  title: string;
  blurb: string;
}
