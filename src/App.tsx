import { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { getLesson, lessonsIn, LESSONS, pageOf } from './curriculum';
import { languageFor, monaco } from './monaco';
import * as api from './lib/api';
import type { Lesson } from './curriculum/types';
import LessonPanel, { type CheckResult } from './components/LessonPanel';
import MapView from './components/MapView';
import { ActivityBar, BottomPanel, PreviewPane, SideBar, StatusBar, type PanelTab, type SideView } from './components/Workbench';
import { CloseIcon, PlayIcon, StopIcon } from './components/Icons';

const MAP_TAB = '__map__';
const SOLUTION = 'solution:';
const FIRST_LESSON = LESSONS[0].id;

/** Shows a folder relative to the workspace, like the short prompt in a real terminal. */
function shortPath(cwd: string, workspace: string) {
  return cwd.startsWith(workspace + '/') ? cwd.slice(workspace.length + 1) : cwd;
}

/** Open the lesson's main file, plus the page it previews when that's a different file. */
function startTabs(lesson: Lesson, files: Record<string, string>) {
  const page = pageOf(lesson);
  return lesson.kind === 'web' && page !== lesson.entry && page in files ? [lesson.entry, page] : [lesson.entry];
}

function remembered(): string {
  try {
    const id = localStorage.getItem('bs-lesson');
    return id && getLesson(id) ? id : FIRST_LESSON;
  } catch {
    return FIRST_LESSON;
  }
}

export default function App() {
  const [lessonId, setLessonId] = useState(remembered);
  const lesson = getLesson(lessonId)!;
  const isWeb = lesson.kind === 'web';
  const isProject = lesson.kind === 'project';
  const canRun = lesson.kind === 'python' || lesson.kind === 'rust' || lesson.kind === 'node';

  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [assets, setAssets] = useState<string[]>([]);
  const [folder, setFolder] = useState('');
  const [tabs, setTabs] = useState<string[]>([]);
  const [active, setActive] = useState('');
  const [done, setDone] = useState<string[]>([]);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [bottomTab, setBottomTab] = useState<PanelTab>('terminal');
  const [devState, setDevState] = useState<'stopped' | 'starting' | 'running'>('stopped');
  const [devLog, setDevLog] = useState<string[]>([]);
  const [sideView, setSideView] = useState<SideView>('explorer');
  const [nonce, setNonce] = useState(0);
  const [cursor, setCursor] = useState({ line: 1, col: 1, selected: 0 });
  const [prompt, setPrompt] = useState('');

  const filesRef = useRef(files);
  filesRef.current = files;
  const lessonRef = useRef(lessonId);
  lessonRef.current = lessonId;
  const saveTimer = useRef<number | undefined>(undefined);
  const dirty = useRef(false);
  const nonceRef = useRef(0);
  const waiters = useRef<{ nonce: number; resolve: () => void }[]>([]);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const trackLessons = lessonsIn(lesson.trackId);
  const position = trackLessons.findIndex((l) => l.id === lessonId) + 1;
  const trackDone = trackLessons.filter((l) => done.includes(l.id)).length;
  const next = trackLessons[position];

  /* ----- progress ----- */
  useEffect(() => {
    api.loadProgress().then(setDone).catch(() => {});
  }, []);

  /* ----- load a lesson's files (seed from the starter the first time) ----- */
  useEffect(() => {
    let cancelled = false;
    try {
      localStorage.setItem('bs-lesson', lessonId);
    } catch {
      /* private window: fine */
    }
    setFiles(null);
    setResults(null);
    setOutput('');
    setBottomTab('terminal');
    api.stopRun().catch(() => {});
    (async () => {
      const current = getLesson(lessonId)!;
      let data = await api.loadFiles(lessonId);
      if (!data.files) data = await api.seedLesson(lessonId);
      if (cancelled) return;
      setFiles(data.files);
      setAssets(data.assets ?? []);
      setFolder(data.folder ?? '');
      setTabs(startTabs(current, data.files ?? {}));
      setActive(current.entry);
      bumpPreview();
      const info = await api.shellInfo(lessonId);
      if (!cancelled) setPrompt(shortPath(info.cwd, info.workspace));
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  /* ----- console output from the preview page ----- */
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow || !e.data?.__buildSchool) return;
      const prefix = e.data.level === 'error' ? 'Error: ' : e.data.level === 'warn' ? 'Warning: ' : '';
      setOutput((o) => o + prefix + e.data.text + '\n');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  /* ----- saving and preview reloads ----- */
  /** Reloads the preview. Clears the old page's console output unless keepOutput is set. */
  function bumpPreview(keepOutput = false) {
    nonceRef.current += 1;
    setNonce(nonceRef.current);
    if (!keepOutput && getLesson(lessonRef.current)?.kind === 'web') setOutput('');
    return nonceRef.current;
  }

  const persist = useCallback(async () => {
    window.clearTimeout(saveTimer.current);
    if (!dirty.current || !filesRef.current) return;
    dirty.current = false;
    await api.saveFiles(lessonRef.current, filesRef.current);
  }, []);

  const saveAndRefresh = useCallback(async () => {
    await persist();
    if (getLesson(lessonRef.current)?.kind === 'web') bumpPreview();
  }, [persist]);

  const saveRef = useRef(saveAndRefresh);
  saveRef.current = saveAndRefresh;

  function onEdit(value: string) {
    if (!filesRef.current || active === MAP_TAB || active.startsWith(SOLUTION)) return;
    const updated = { ...filesRef.current, [active]: value };
    filesRef.current = updated;
    setFiles(updated);
    dirty.current = true;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => saveRef.current(), 600);
  }

  /** Reloads the preview and resolves once that exact reload has finished loading. */
  function reloadPreview() {
    return new Promise<void>((resolve) => {
      const target = bumpPreview();
      waiters.current.push({ nonce: target, resolve });
      window.setTimeout(resolve, 5000); // never hang the Check button
    });
  }

  function onFrameLoad() {
    const src = frameRef.current?.getAttribute('src') ?? '';
    const loaded = Number(new URL(src, window.location.href).searchParams.get('v'));
    waiters.current = waiters.current.filter((w) => {
      if (w.nonce <= loaded) {
        w.resolve();
        return false;
      }
      return true;
    });
  }

  /* ----- running Python and Rust ----- */
  /** Runs the program. When checking, it runs the lesson's check file with its stdin answers. */
  async function run(checking = false): Promise<string> {
    await persist();
    if (lesson.kind === 'web') {
      await reloadPreview();
      return '';
    }
    setOutput('');
    setRunning(true);
    setBottomTab('terminal');
    try {
      const entry = checking ? lesson.checkEntry ?? lesson.entry : lesson.entry;
      const options = checking ? { stdin: lesson.stdin ?? '', test: lesson.cargoTest } : {};
      return await api.runProgram(lessonId, lesson.kind, entry, (chunk) => setOutput((o) => o + chunk), options);
    } catch (err) {
      setOutput((o) => o + `\n[${(err as Error).message}]\n`);
      return '';
    } finally {
      setRunning(false);
    }
  }

  /* ----- dev servers (project lessons) ----- */
  const devUrl = `http://localhost:${lesson.devPort ?? 4800}/`;

  /** Waits until the dev server answers (an opaque no-cors response is enough to know it's up). */
  async function waitForDev(url: string, lesson: string) {
    for (let i = 0; i < 120 && lessonRef.current === lesson; i++) {
      try {
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
        return true;
      } catch {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    return false;
  }

  async function startDev() {
    await persist();
    setDevState('starting');
    setBottomTab('dev');
    await api.devServer(lessonId, 'start', lesson.devCommand ?? 'npm run dev');
    const up = await waitForDev(devUrl, lessonId);
    if (lessonRef.current !== lessonId) return;
    setDevState(up ? 'running' : 'stopped');
    if (up) bumpPreview(true);
  }

  async function stopDev() {
    await api.devServer(lessonId, 'stop');
    setDevState('stopped');
  }

  // While a project lesson is open, keep the Dev Server log fresh and notice if the server stops.
  useEffect(() => {
    if (!isProject) return;
    let alive = true;
    const tick = async () => {
      const status = await api.devStatus(lessonId, lesson.devPort ?? 4800).catch(() => null);
      if (!alive || !status) return;
      setDevLog(status.log);
      if (!status.running) setDevState((s) => (s === 'starting' ? s : 'stopped'));
      else setDevState((s) => (s === 'stopped' ? 'running' : s));
    };
    tick();
    const timer = window.setInterval(tick, 1500);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [isProject, lessonId]);

  /* ----- the terminal ----- */
  async function shell(command: string) {
    if (command.trim() === 'clear') {
      setOutput('');
      return;
    }
    await persist();
    setBottomTab('terminal');
    setOutput((o) => `${o}${o && !o.endsWith('\n') ? '\n' : ''}${prompt} $ ${command}\n`);
    setRunning(true);
    try {
      const info = await api.shellInfo(lessonId);
      await api.runShell(lessonId, command, (chunk) => setOutput((o) => o + chunk), (cwd) => setPrompt(shortPath(cwd, info.workspace)));
    } finally {
      setRunning(false);
    }
    // Commands can create, change or delete files: refresh the Explorer and editor.
    const data = await api.loadFiles(lessonId);
    if (data.files && lessonRef.current === lessonId) {
      filesRef.current = data.files;
      setFiles(data.files);
      setAssets(data.assets ?? []);
      if (lesson.kind === 'web') bumpPreview(true);
    }
  }

  /* ----- checking work ----- */
  /**
   * Loads the page in its own invisible 1200x800 frame for checking: the same size the tests use, whatever
   * the size of your window. It sits behind the app at zero opacity rather than off-screen, because an
   * off-screen frame never counts as "in view" (IntersectionObserver checks would fail).
   */
  async function openCheckFrame() {
    const frame = document.createElement('iframe');
    frame.className = 'check-frame';
    frame.setAttribute('width', '1200');
    frame.setAttribute('height', '800');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    const loaded = new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));
    frame.src = `/preview/${lessonId}/${pageOf(lesson) === 'index.html' ? '' : pageOf(lesson)}?check=${Date.now()}`;
    document.body.append(frame);
    await Promise.race([loaded, new Promise((r) => setTimeout(r, 8000))]);
    await frame.contentDocument?.fonts?.ready; // so font checks see loaded fonts
    return frame;
  }

  async function checkWork() {
    setChecking(true);
    let checkFrame: HTMLIFrameElement | null = null;
    try {
      let doc = document.implementation.createHTMLDocument('');
      let win: Window = window;
      let out = '';
      if (lesson.kind === 'web') {
        await persist();
        bumpPreview(); // your visible preview shows the saved version too
        checkFrame = await openCheckFrame();
        doc = checkFrame.contentDocument ?? doc;
        win = checkFrame.contentWindow ?? win;
      } else {
        out = await run(true);
      }
      // In order, one at a time: a check may click something the next check relies on.
      const res: CheckResult[] = [];
      for (const c of lesson.checks) {
        let pass = false;
        try {
          pass = !!(await c.test({ doc, win, files: filesRef.current ?? {}, output: out }));
        } catch {
          pass = false;
        }
        res.push({ label: c.label, pass });
      }
      setResults(res);
      setBottomTab('checks');
      if (res.every((r) => r.pass) && !done.includes(lessonId)) {
        const updated = [...done, lessonId];
        setDone(updated);
        api.saveProgress(updated).catch(() => {});
      }
    } finally {
      checkFrame?.remove();
      setChecking(false);
    }
  }

  async function resetLesson() {
    if (!window.confirm('Start this lesson over? Your changes to it will be replaced with the starter code.')) return;
    window.clearTimeout(saveTimer.current);
    dirty.current = false;
    const data = await api.seedLesson(lessonId, true);
    setFiles(data.files);
    setAssets(data.assets ?? []);
    setTabs(startTabs(lesson, data.files ?? {}));
    setActive(lesson.entry);
    setResults(null);
    bumpPreview();
  }

  /* ----- tabs ----- */
  function openTab(id: string) {
    setTabs((t) => (t.includes(id) ? t : [...t, id]));
    setActive(id);
  }

  function closeTab(id: string) {
    setTabs((t) => {
      const left = t.filter((x) => x !== id);
      if (active === id) setActive(left[left.length - 1] ?? '');
      return left;
    });
  }

  function openTrack(trackId: string) {
    const lessons = lessonsIn(trackId);
    const target = lessons.find((l) => !done.includes(l.id)) ?? lessons[0];
    if (target) setLessonId(target.id);
  }

  const onMount: OnMount = (editor) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => saveRef.current());
    editor.onDidChangeCursorSelection((e) => {
      const model = editor.getModel();
      setCursor({
        line: e.selection.positionLineNumber,
        col: e.selection.positionColumn,
        selected: model ? model.getValueInRange(e.selection).length : 0,
      });
    });
  };

  const showPreview = (isWeb || isProject) && active !== MAP_TAB;
  const isSolution = active.startsWith(SOLUTION);
  const filePath = isSolution ? active.slice(SOLUTION.length) : active;
  const content = isSolution ? lesson.solution[filePath] ?? '' : files?.[active] ?? '';
  const tabLabel = (id: string) => (id === MAP_TAB ? 'Curriculum Map' : id.startsWith(SOLUTION) ? `${id.slice(SOLUTION.length).split('/').pop()} (solution)` : id.split('/').pop());

  return (
    <div className="app">
      <div className="titlebar">
        <span className="titlebar-text">{active === MAP_TAB ? 'Curriculum Map' : filePath || lesson.title} · {lesson.id} · Build School</span>
      </div>

      <div className={`wb${sideView && files ? '' : ' wb--side-closed'}`}>
        <LessonPanel
          key={lessonId}
          lesson={lesson}
          position={position}
          trackTotal={trackLessons.length}
          trackDone={trackDone}
          done={done.includes(lessonId)}
          results={results}
          checking={checking}
          hasNext={!!next}
          onCheck={checkWork}
          onRun={() => run()}
          onNext={() => next && setLessonId(next.id)}
          onReset={resetLesson}
          onShowSolution={() => openTab(SOLUTION + lesson.entry)}
        />

        <ActivityBar view={sideView} mapOpen={active === MAP_TAB} onView={setSideView} onMap={() => openTab(MAP_TAB)} />

        {sideView && files && (
          <SideBar
            view={sideView}
            lesson={lesson}
            files={files}
            assets={assets}
            activeFile={active}
            folder={folder}
            done={done}
            onOpenFile={openTab}
            onOpenLesson={setLessonId}
            onMap={() => openTab(MAP_TAB)}
          />
        )}

        <main className={`main${showPreview ? '' : ' main--no-preview'}`}>
          <section className="eg" aria-label="Editor">
            <div className="tabs">
              {tabs.map((id) => (
                <div key={id} className={`tab${id === active ? ' tab--on' : ''}`}>
                  <button type="button" className="tab-name" onClick={() => setActive(id)}>
                    {tabLabel(id)}
                  </button>
                  <button type="button" className="tab-close" aria-label={`Close ${tabLabel(id)}`} onClick={() => closeTab(id)}>
                    <CloseIcon />
                  </button>
                </div>
              ))}
              <span className="tabs-spacer" />
              {canRun &&
                (running ? (
                  <button type="button" className="icon-btn run-btn" aria-label="Stop" title="Stop" onClick={() => api.stopRun()}>
                    <StopIcon />
                  </button>
                ) : (
                  <button type="button" className="icon-btn run-btn" aria-label="Run" title={lesson.kind === 'python' ? 'Run Python file' : lesson.kind === 'node' ? 'Run with Node' : 'cargo run'} onClick={() => run()}>
                    <PlayIcon />
                  </button>
                ))}
            </div>
            {active === MAP_TAB ? (
              <MapView done={done} onOpenTrack={openTrack} />
            ) : files && active ? (
              <div className="ed">
                <Editor
                  theme="rfd-night"
                  path={`${lessonId}/${active}`}
                  language={languageFor(filePath)}
                  value={content}
                  onChange={(v) => onEdit(v ?? '')}
                  onMount={onMount}
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Ubuntu Mono', monospace",
                    automaticLayout: true,
                    readOnly: isSolution,
                    tabSize: 2,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    minimap: { enabled: true },
                    renderWhitespace: 'selection',
                    bracketPairColorization: { enabled: true },
                  }}
                />
              </div>
            ) : (
              <div className="ed-empty">{files ? 'Open a file from the Explorer.' : 'Loading lesson...'}</div>
            )}
          </section>

          {showPreview && files && (
            <PreviewPane
              lessonId={lessonId}
              entry={pageOf(lesson)}
              nonce={nonce}
              frameRef={frameRef}
              onLoad={onFrameLoad}
              onReload={() => saveAndRefresh()}
              dev={isProject ? { url: devUrl, state: devState, onStart: startDev, onStop: stopDev } : undefined}
            />
          )}

          <BottomPanel
            tab={bottomTab}
            onTab={setBottomTab}
            devLog={isProject ? devLog : undefined}
            output={output}
            running={running}
            prompt={prompt}
            onShell={shell}
            results={results}
            onStdin={(text) => {
              setOutput((o) => o + text + '\n');
              api.sendStdin(text).catch(() => {});
            }}
          />
        </main>
      </div>

      <StatusBar
        lesson={lesson}
        trackDone={trackDone}
        trackTotal={trackLessons.length}
        line={cursor.line}
        col={cursor.col}
        selected={cursor.selected}
        language={active === MAP_TAB ? 'Map' : languageFor(filePath)}
      />
    </div>
  );
}
