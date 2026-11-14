import { STAGES } from '../curriculum/map';
import { lessonsIn } from '../curriculum';
import { ArrowIcon } from './Icons';

interface Props {
  done: string[];
  onOpenTrack: (trackId: string) => void;
}

export default function MapView({ done, onOpenTrack }: Props) {
  return (
    <div className="map">
      <header className="map-head">
        <p className="eyebrow">
          <span>Curriculum map</span>
        </p>
        <h1 className="map-title">
          From your first tag
          <span className="heading-outline">to production-ready sites and apps</span>
        </h1>
        <p className="map-lede">
          Seven stages, from plain HTML to shipping a dashboard to production. Many tracks end with capstone ideas: projects
          you'll be able to build on your own by that point. Tracks marked{' '}
          <span className="map-badge map-badge--suggested">Why this</span> explain why they sit where they do.
        </p>
      </header>

      {STAGES.map((stage) => (
        <section key={stage.title} className="map-stage">
          <p className="eyebrow">
            <span>{stage.title.split('.')[0]}</span>
          </p>
          <h2 className="map-stage-title">{stage.title.split('. ').slice(1).join('. ') || stage.title}</h2>
          <p className="map-stage-summary">{stage.summary}</p>
          <div className="map-tracks">
            {stage.tracks.map((t) => {
              const lessons = lessonsIn(t.id);
              const finished = lessons.filter((l) => done.includes(l.id)).length;
              return (
                <article key={t.id} className={`map-track map-track--${t.status} surface`}>
                  <header className="map-track-head">
                    <h3 className="map-track-title">{t.title}</h3>
                    {t.status === 'built' ? (
                      <span className="map-badge map-badge--built">
                        {finished}/{lessons.length} done
                      </span>
                    ) : (
                      <span className="map-badge">Planned</span>
                    )}
                    {t.suggested && <span className="map-badge map-badge--suggested">Why this</span>}
                  </header>
                  {t.suggested && <p className="map-why">{t.suggested}</p>}
                  <ol className="map-modules">
                    {t.modules.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ol>
                  {t.capstones.length > 0 && (
                    <div className="map-caps">
                      <p className="map-caps-title">Capstones</p>
                      <ul>
                        {t.capstones.map((c) => (
                          <li key={c.name} className="map-cap">
                            <strong>{c.name}</strong>
                            <span>{c.what}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {t.status === 'built' && (
                    <button className="map-open rfd-cta rfd-cta--sm" type="button" onClick={() => onOpenTrack(t.id)}>
                      <span className="rfd-cta-icon">
                        <ArrowIcon />
                      </span>
                      <span className="rfd-cta-label">
                        {finished > 0 ? 'Continue' : 'Start'} {t.title}
                      </span>
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
