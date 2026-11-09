import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ErrorState } from "@/components/Feedback";
import { HeartButton } from "@/components/HeartButton";
import { Row } from "@/components/Row";
import { api, embedUrl, runtime, type ApiError } from "@/lib/api";
import type { Episode, Title } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";

/** One page for movies and series: backdrop, facts, the player and, for series, the episode list. */
export function Detail({ kind }: { kind: "pelicula" | "serie" }) {
  const { slug = "" } = useParams();
  const location = useLocation();
  const { data: title, error, retry } = useAsync(
    () => (kind === "pelicula" ? api.movie(slug) : api.series(slug)),
    `${kind}/${slug}`,
  );
  const home = useAsync(api.home, "home");
  const [playing, setPlaying] = useState<string | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const player = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlaying(null);
    setEpisode(null);
    window.scrollTo(0, 0);
  }, [slug]);

  useLayoutEffect(() => {
    if (!title || !root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".detail-bg", { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 0.55, duration: 2, ease: "expo.out" });
      gsap.from(".detail-in", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.07 });
    }, root.current);
    return () => ctx.revert();
  }, [title]);

  const play = (t: Title, ep?: Episode) => {
    const video = t.type === "MOVIE" ? t.video : (ep ?? t.episodes[0]).video;
    setEpisode(t.type === "SERIES" ? (ep ?? t.episodes[0]) : null);
    setPlaying(video);
    api.play(t.type, t.id).catch(() => undefined);
    requestAnimationFrame(() => player.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  // "Reproducir" on the home hero links here with #ver.
  useEffect(() => {
    if (title && location.hash === "#ver" && !playing) play(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, location.hash]);

  if (error) {
    return <ErrorState message={(error as ApiError).status === 404 ? "Este título no está en el catálogo." : error.message} onRetry={retry} />;
  }
  if (!title) return <div className="h-[80svh] animate-pulse bg-coal/40" />;

  const related = home.data
    ? [...home.data.movies, ...home.data.series].filter((t) => t.category === title.category && t.id !== title.id)
    : [];
  const category = home.data?.categories.find((c) => c.slug === title.category);

  return (
    <div ref={root}>
      <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36">
        <img src={title.backdrop} alt="" className="detail-bg absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />

        <div className="relative mx-auto grid max-w-[1600px] gap-10 px-4 sm:px-10 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">
          <img
            src={title.poster}
            alt={`Afiche de ${title.name}`}
            className="detail-in hidden aspect-[2/3] w-full rounded-2xl object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:block"
          />
          <div className="self-end">
            {category ? (
              <Link to={`/categoria/${category.slug}`} className="detail-in inline-block text-xs font-semibold tracking-[0.2em] text-signal uppercase">
                {category.name}
              </Link>
            ) : null}
            <h1 className="detail-in mt-3 font-serif text-[clamp(46px,7vw,112px)] leading-[0.9] tracking-tight">{title.name}</h1>
            {title.originalName && title.originalName !== title.name ? (
              <p className="detail-in mt-2 font-serif text-xl text-dim italic">{title.originalName}</p>
            ) : null}
            <p className="detail-in mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mist/80">
              <span className="rounded border border-cream/30 px-1.5 py-0.5 text-xs text-cream">{title.classification}</span>
              <span>{title.year}</span>
              <span aria-hidden="true">·</span>
              <span>{title.type === "MOVIE" ? runtime(title.duration) : `${title.episodes.length} episodios`}</span>
              <span aria-hidden="true">·</span>
              <span>{title.country}</span>
              <span aria-hidden="true">·</span>
              <span>{title.views.toLocaleString("es")} reproducciones</span>
            </p>
            <p className="detail-in mt-6 max-w-2xl text-lg leading-relaxed text-mist/90">{title.description}</p>
            <dl className="detail-in mt-6 grid max-w-2xl gap-2 text-sm sm:grid-cols-[110px_1fr]">
              <dt className="text-dim">{title.type === "MOVIE" ? "Dirección" : "Creación"}</dt>
              <dd>{title.type === "MOVIE" ? title.director : title.creator}</dd>
              <dt className="text-dim">Reparto</dt>
              <dd>{title.cast.join(", ")}</dd>
            </dl>
            <div className="detail-in mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={() => play(title)}>
                <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M0 0v16l14-8z" /></svg>
                {title.type === "MOVIE" ? "Reproducir" : "Ver episodio 1"}
              </button>
              <HeartButton title={title} withLabel />
            </div>
          </div>
        </div>
      </section>

      <section id="ver" ref={player} className="mx-auto max-w-[1300px] scroll-mt-24 px-4 sm:px-10">
        {playing ? (
          <div className="overflow-hidden rounded-2xl border border-cream/10 bg-black shadow-2xl">
            <div className="aspect-video">
              <iframe
                key={playing}
                src={embedUrl(playing)}
                title={episode ? `${title.name}: ${episode.name}` : title.name}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-xs text-dim">
              <span>{episode ? `Episodio ${episode.number}: ${episode.name}` : title.name}</span>
              <span>
                Copia de dominio público servida por{" "}
                <a className="underline hover:text-cream" href={`https://archive.org/details/${playing}`} target="_blank" rel="noreferrer">
                  Internet Archive
                </a>
              </span>
            </p>
          </div>
        ) : null}
      </section>

      {title.type === "SERIES" ? (
        <section className="mx-auto mt-12 max-w-[1300px] px-4 sm:px-10" aria-labelledby="episodios">
          <h2 id="episodios" className="text-2xl font-semibold tracking-tight">
            Episodios <span className="text-dim">· Temporada {title.season}</span>
          </h2>
          <ol className="mt-5 divide-y divide-cream/10 border-y border-cream/10">
            {title.episodes.map((ep) => {
              const current = episode?.number === ep.number && playing;
              return (
                <li key={ep.number}>
                  <button
                    type="button"
                    onClick={() => play(title, ep)}
                    aria-current={current ? "true" : undefined}
                    className="group grid w-full grid-cols-[40px_1fr_auto] items-center gap-4 py-5 text-left transition-colors hover:bg-cream/5 sm:grid-cols-[60px_1fr_auto] sm:px-3"
                  >
                    <span className={`font-serif text-3xl ${current ? "text-signal" : "text-dim group-hover:text-cream"}`}>{ep.number}</span>
                    <span>
                      <span className="block font-semibold">{ep.name}</span>
                      <span className="text-sm text-dim">{ep.year}</span>
                    </span>
                    <span className="text-sm text-dim">{runtime(ep.duration)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <Row title="Si te gustó, mira también" titles={related} />
      <div className="h-16" />
    </div>
  );
}
