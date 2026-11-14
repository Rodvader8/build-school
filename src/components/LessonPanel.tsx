import { useMemo, useState } from 'react';
import { marked } from 'marked';
import type { Lesson } from '../curriculum/types';
import { TRACKS } from '../curriculum';
import { ArrowIcon, CheckIcon, CircleIcon, ExternalIcon, PlayIcon } from './Icons';

export interface CheckResult {
  label: string;
  pass: boolean;
}

interface Props {
  lesson: Lesson;
  position: number; // 1-based within its track
  trackTotal: number;
  trackDone: number;
  done: boolean;
  results: CheckResult[] | null;
  checking: boolean;
  hasNext: boolean;
  onCheck: () => void;
  onRun: () => void;
  onNext: () => void;
  onReset: () => void;
  onShowSolution: () => void;
}

export default function LessonPanel(p: Props) {
  const { lesson } = p;
  const [hintsShown, setHintsShown] = useState(0);
  const html = useMemo(() => marked.parse(lesson.body, { async: false }) as string, [lesson.body]);
  const track = TRACKS.find((t) => t.id === lesson.trackId);
  const allPassed = !!p.results && p.results.every((r) => r.pass);
  const isPlayground = lesson.checks.length === 0;
  const passedCount = p.results?.filter((r) => r.pass).length ?? 0;

  return (
    <aside className="lp" aria-label="Lesson">
      <header className="lp-top">
        <div className="lp-brand">
          <img className="lp-mark" src="/brand/rfd-mark.png" alt="Rod Fernandez Design brand mark" height="36" />
          <div>
            <p className="lp-name">Build School</p>
            <p className="lp-wordmark">rod fernandez design</p>
          </div>
        </div>
        <div className="lp-track">
          <span className="lp-track-name">{track?.title}</span>
          {!isPlayground && (
            <span className="lp-track-count">
              {p.trackDone} of {p.trackTotal} done
            </span>
          )}
        </div>
        {!isPlayground && (
          <progress className="lp-progress" max={p.trackTotal} value={p.trackDone}>
            {p.trackDone} of {p.trackTotal}
          </progress>
        )}
      </header>

      <div className="lp-scroll">
        <div className="lp-meta">
          <p className="eyebrow">
            <span>
              {isPlayground ? 'Playground' : `Lesson ${p.position} of ${p.trackTotal}`}
              {lesson.minutes > 0 && ` · ${lesson.minutes} min`}
            </span>
          </p>
          {p.done && <span className="lp-done-pill">Completed</span>}
        </div>
        <h1 className="lp-title">{lesson.title}</h1>

        <div className="lp-body" dangerouslySetInnerHTML={{ __html: html }} />

        {!isPlayground && (
          <section className="lp-card surface" aria-labelledby="goals-h">
            <h2 id="goals-h" className="lp-card-title">
              Your goals
              {p.results && (
                <span className="lp-score">
                  {passedCount}/{p.results.length}
                </span>
              )}
            </h2>
            <ul className="lp-goals">
              {lesson.checks.map((c, i) => {
                const r = p.results?.[i];
                const state = !r ? 'todo' : r.pass ? 'pass' : 'fail';
                return (
                  <li key={c.label} className={`lp-goal lp-goal--${state}`}>
                    {state === 'pass' ? <CheckIcon className="lp-goal-icon" /> : <CircleIcon className="lp-goal-icon" />}
                    <span>{c.label}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {allPassed && !isPlayground && (
          <section className="lp-win surface" role="status">
            <p className="lp-win-title">Nailed it.</p>
            <p>Every goal passed. Your work is saved in the workspace folder.</p>
            {p.hasNext && (
              <button className="rfd-cta rfd-cta--sm" type="button" onClick={p.onNext}>
                <span className="rfd-cta-icon">
                  <ArrowIcon />
                </span>
                <span className="rfd-cta-label">Next lesson</span>
              </button>
            )}
          </section>
        )}

        {lesson.hints.length > 0 && (
          <section className="lp-card surface" aria-labelledby="hints-h">
            <h2 id="hints-h" className="lp-card-title">
              Stuck?
            </h2>
            {lesson.hints.slice(0, hintsShown).map((h, i) => (
              <p key={h} className="lp-hint">
                <strong>Hint {i + 1}.</strong> {h}
              </p>
            ))}
            <div className="lp-row">
              {hintsShown < lesson.hints.length && (
                <button className="text-link" type="button" onClick={() => setHintsShown((n) => n + 1)}>
                  {hintsShown === 0 ? 'Show a hint' : 'Another hint'}
                </button>
              )}
              {Object.keys(lesson.solution).length > 0 && hintsShown >= lesson.hints.length && (
                <button className="text-link" type="button" onClick={p.onShowSolution}>
                  Peek at the solution
                </button>
              )}
            </div>
          </section>
        )}

        {lesson.realWorld && (
          <a className="lp-real surface" href={lesson.realWorld.href} target="_blank" rel="noopener noreferrer">
            <span className="lp-real-label">On a real site</span>
            <span>{lesson.realWorld.label}</span>
            <ExternalIcon className="lp-real-icon" />
          </a>
        )}
      </div>

      <footer className="lp-actions">
        {isPlayground ? (
          <button className="rfd-cta" type="button" onClick={p.onRun}>
            <span className="rfd-cta-icon">
              <PlayIcon />
            </span>
            <span className="rfd-cta-label">{lesson.kind === 'web' ? 'Refresh preview' : 'Run'}</span>
          </button>
        ) : allPassed && p.hasNext ? (
          <button className="rfd-cta" type="button" onClick={p.onNext}>
            <span className="rfd-cta-icon">
              <ArrowIcon />
            </span>
            <span className="rfd-cta-label">Next lesson</span>
          </button>
        ) : (
          <button className="rfd-cta" type="button" onClick={p.onCheck} disabled={p.checking}>
            <span className="rfd-cta-icon">
              <CheckIcon />
            </span>
            <span className="rfd-cta-label">{p.checking ? 'Checking...' : 'Check my work'}</span>
          </button>
        )}
        <button className="text-link" type="button" onClick={p.onReset}>
          Start over
        </button>
      </footer>
    </aside>
  );
}
