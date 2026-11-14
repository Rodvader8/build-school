import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import type { Lesson } from '../curriculum/types';
import { LESSONS, TRACKS } from '../curriculum';
import { STAGES } from '../curriculum/map';
import type { CheckResult } from './LessonPanel';
import { BookIcon, CheckIcon, CircleIcon, ExternalIcon, FileIcon, FilesIcon, MapIcon, PlayIcon, RefreshIcon, StopIcon } from './Icons';

export type SideView = 'explorer' | 'curriculum' | null;

/* ---------- Activity bar (far-left icon strip) ---------- */
export function ActivityBar(props: { view: SideView; mapOpen: boolean; onView: (v: SideView) => void; onMap: () => void }) {
  const item = (v: Exclude<SideView, null>, label: string, icon: ReactNode) => (
    <button
      type="button"
      className={`ab-item${props.view === v ? ' ab-item--on' : ''}`}
      aria-label={label}
      aria-pressed={props.view === v}
      title={label}
      onClick={() => props.onView(props.view === v ? null : v)}
    >
      {icon}
    </button>
  );
  return (
    <nav className="ab" aria-label="Views">
      {item('explorer', 'Explorer', <FilesIcon />)}
      {item('curriculum', 'Curriculum', <BookIcon />)}
      <button type="button" className={`ab-item${props.mapOpen ? ' ab-item--on' : ''}`} aria-label="Curriculum map" title="Curriculum map" onClick={props.onMap}>
        <MapIcon />
      </button>
    </nav>
  );
}

/* ---------- Side bar ---------- */
export function SideBar(props: {
  view: Exclude<SideView, null>;
  lesson: Lesson;
  files: Record<string, string>;
  assets: string[];
  activeFile: string;
  folder: string;
  done: string[];
  onOpenFile: (f: string) => void;
  onOpenLesson: (id: string) => void;
  onMap: () => void;
}) {
  if (props.view === 'explorer') {
    const byPath = (a: string, b: string) => a.split('/').length - b.split('/').length || a.localeCompare(b);
    const names = [...Object.keys(props.files), ...props.assets].sort(byPath);
    const label = (f: string) => (
      <>
        <FileIcon className="sb-file-icon" />
        <span className="sb-file-dir">{f.includes('/') ? f.slice(0, f.lastIndexOf('/') + 1) : ''}</span>
        {f.split('/').pop()}
      </>
    );
    return (
      <section className="sb" aria-label="Explorer">
        <h2 className="sb-title">Explorer</h2>
        <p className="sb-folder">{props.lesson.id}</p>
        <ul className="sb-files">
          {names.map((f) => (
            <li key={f}>
              {f in props.files ? (
                <button type="button" className={`sb-file${f === props.activeFile ? ' sb-file--on' : ''}`} onClick={() => props.onOpenFile(f)}>
                  {label(f)}
                </button>
              ) : (
                <span className="sb-file sb-file--asset" title="A font or image. Your code can use it, but it can't be opened as text.">
                  {label(f)}
                </span>
              )}
            </li>
          ))}
        </ul>
        {props.folder && (
          <p className="sb-note">
            Saved on disk in
            <code>{props.folder}</code>
            Open that folder in real VS Code any time.
          </p>
        )}
      </section>
    );
  }

  const planned = STAGES.flatMap((s) => s.tracks).filter((t) => t.status === 'planned');
  return (
    <section className="sb" aria-label="Curriculum">
      <h2 className="sb-title">Curriculum</h2>
      {TRACKS.map((t) => (
        <div key={t.id} className="sb-track">
          <h3 className="sb-track-title">{t.title}</h3>
          <ol className="sb-lessons">
            {LESSONS.filter((l) => l.trackId === t.id).map((l) => (
              <li key={l.id}>
                <button type="button" className={`sb-lesson${l.id === props.lesson.id ? ' sb-lesson--on' : ''}`} onClick={() => props.onOpenLesson(l.id)}>
                  {props.done.includes(l.id) ? <CheckIcon className="sb-tick sb-tick--done" /> : <CircleIcon className="sb-tick" />}
                  <span>{l.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <div className="sb-track">
        <h3 className="sb-track-title">Coming next</h3>
        <ul className="sb-planned">
          {planned.slice(0, 6).map((t) => (
            <li key={t.id}>{t.title}</li>
          ))}
        </ul>
        <button type="button" className="sb-link" onClick={props.onMap}>
          See the whole map ({planned.length} more tracks)
        </button>
      </div>
    </section>
  );
}

/* ---------- Preview (VS Code's Simple Browser) ---------- */
export function PreviewPane(props: {
  lessonId: string;
  entry: string;
  nonce: number;
  frameRef: RefObject<HTMLIFrameElement | null>;
  onLoad: () => void;
  onReload: () => void;
  /** Project lessons: the dev server's address, and controls for it. */
  dev?: { url: string; state: 'stopped' | 'starting' | 'running'; onStart: () => void; onStop: () => void };
}) {
  const path = props.dev ? props.dev.url : `/preview/${props.lessonId}/${props.entry === 'index.html' ? '' : props.entry}`;
  const url = props.dev ? props.dev.url : `${window.location.origin}${path}`;
  if (props.dev && props.dev.state !== 'running') {
    return (
      <section className="pv" aria-label="Preview">
        <div className="tabs">
          <span className="tab tab--on">Simple Browser</span>
        </div>
        <div className="pv-bar">
          <span className="pv-url">{url}</span>
        </div>
        <div className="pv-idle">
          <p>{props.dev.state === 'starting' ? 'Starting the dev server... (the first start can take a little while)' : 'This project runs on its own dev server.'}</p>
          {props.dev.state === 'stopped' && (
            <button type="button" className="rfd-cta rfd-cta--sm" onClick={props.dev.onStart}>
              <span className="rfd-cta-icon">
                <PlayIcon />
              </span>
              <span className="rfd-cta-label">Start dev server</span>
            </button>
          )}
          <p className="pv-idle-note">Run npm install in the terminal first. Watch the Dev Server tab below for its log.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="pv" aria-label="Preview">
      <div className="tabs">
        <span className="tab tab--on">Simple Browser</span>
      </div>
      <div className="pv-bar">
        <button type="button" className="icon-btn" aria-label="Reload preview" title="Reload" onClick={props.onReload}>
          <RefreshIcon />
        </button>
        <span className="pv-url">{url}</span>
        <a className="icon-btn" href={url} target="_blank" rel="noopener noreferrer" aria-label="Open in a new browser tab" title="Open in browser">
          <ExternalIcon />
        </a>
        {props.dev && (
          <button type="button" className="icon-btn" aria-label="Stop the dev server" title="Stop the dev server" onClick={props.dev.onStop}>
            <StopIcon />
          </button>
        )}
      </div>
      <iframe ref={props.frameRef} className="pv-frame" title="Your page" src={props.dev ? `${path}${path.includes('?') ? '&' : '?'}v=${props.nonce}` : `${path}?v=${props.nonce}`} onLoad={props.onLoad} />
    </section>
  );
}

/* ---------- Bottom panel: terminal and checks ---------- */
export type PanelTab = 'terminal' | 'checks' | 'dev';

export function BottomPanel(props: {
  tab: PanelTab;
  onTab: (t: PanelTab) => void;
  /** Project lessons: the dev server's log. undefined hides the tab. */
  devLog?: string[];
  output: string;
  running: boolean;
  results: CheckResult[] | null;
  onStdin: (text: string) => void;
  /** The shell prompt, e.g. "html-01-first-page" or "html-01-first-page/images". */
  prompt: string;
  onShell: (command: string) => void;
}) {
  const [line, setLine] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [back, setBack] = useState(0); // how far back in history the Up arrow has gone
  const bodyRef = useRef<HTMLDivElement>(null);
  const stuck = useRef(true); // follow new output unless you've scrolled up to read something

  useEffect(() => {
    const el = bodyRef.current;
    if (el && stuck.current) el.scrollTop = el.scrollHeight;
  }, [props.output, props.tab]);
  return (
    <section className="bp" aria-label="Panel">
      <div className="bp-tabs" role="tablist">
        {(props.devLog ? (['terminal', 'checks', 'dev'] as const) : (['terminal', 'checks'] as const)).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={props.tab === t} className={`bp-tab${props.tab === t ? ' bp-tab--on' : ''}`} onClick={() => props.onTab(t)}>
            {t === 'terminal' ? 'Terminal' : t === 'checks' ? 'Checks' : 'Dev Server'}
            {t === 'checks' && props.results && (
              <span className="bp-count">
                {props.results.filter((r) => r.pass).length}/{props.results.length}
              </span>
            )}
          </button>
        ))}
        {props.running && <span className="bp-running">running</span>}
      </div>
      {props.tab === 'dev' ? (
        <div className="bp-body">
          <pre className="bp-out">{props.devLog?.length ? props.devLog.join('\n') : 'The dev server is not running.'}</pre>
        </div>
      ) : props.tab === 'terminal' ? (
        <div
          className="bp-body"
          ref={bodyRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            stuck.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
          }}
        >
          <pre className="bp-out">{props.output || 'Output from your code shows up here.'}</pre>
          <form
            className="bp-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (props.running) {
                props.onStdin(line);
              } else if (line.trim()) {
                props.onShell(line);
                setHistory((h) => [...h.filter((x) => x !== line), line]);
              }
              setLine('');
              setBack(0);
            }}
          >
            <label htmlFor="shell" className="bp-prompt">
              {props.running ? 'Running. Type a reply and press Enter' : `${props.prompt} $`}
            </label>
            <input
              id="shell"
              className="bp-field"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              onKeyDown={(e) => {
                if (props.running || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
                e.preventDefault();
                const next = Math.max(0, Math.min(history.length, back + (e.key === 'ArrowUp' ? 1 : -1)));
                setBack(next);
                setLine(next === 0 ? '' : history[history.length - next]);
              }}
              placeholder={props.running ? '' : 'Type a command, like ls, and press Enter'}
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      ) : (
        <div className="bp-body">
          {!props.results ? (
            <p className="bp-empty">Press Check my work to test your page against the lesson goals.</p>
          ) : (
            <ul className="bp-checks">
              {props.results.map((r) => (
                <li key={r.label} className={r.pass ? 'bp-pass' : 'bp-fail'}>
                  {r.pass ? 'PASS' : 'TODO'} <span>{r.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------- Status bar ---------- */
export function StatusBar(props: { lesson: Lesson; trackDone: number; trackTotal: number; line: number; col: number; selected: number; language: string }) {
  return (
    <footer className="st">
      <span className="st-item">{props.lesson.id}</span>
      {props.lesson.checks.length > 0 && (
        <span className="st-item">
          {props.trackDone}/{props.trackTotal} lessons done
        </span>
      )}
      <span className="st-spacer" />
      <span className="st-item">
        Ln {props.line}, Col {props.col}
        {props.selected > 0 && ` (${props.selected} selected)`}
      </span>
      <span className="st-item">Spaces: 2</span>
      <span className="st-item">UTF-8</span>
      <span className="st-item">{props.language}</span>
      <span className="st-item">localhost:{window.location.port}</span>
    </footer>
  );
}
