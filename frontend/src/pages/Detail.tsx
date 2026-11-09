import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorState } from "@/components/Feedback";
import { HeartButton } from "@/components/HeartButton";
import { Row } from "@/components/Row";
import { api, embedUrl, runtime, type ApiError } from "@/lib/api";
import { useCatalog } from "@/lib/catalog";
import type { Episode, Title } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";

/**
 * The 2022 "Views" page: the video fills the top with the 50px corners, PLAY sits centred
 * over it, and the black translucent panel below holds the name, the heart and the facts.
 * The facts that were placeholders back then (duración, actores, director) are real now.
 */
export function Detail({ kind }: { kind: "movies" | "series" }) {
  const { id = "" } = useParams();
  const { all } = useCatalog();
  const { data: title, error, retry } = useAsync(() => (kind === "movies" ? api.movie(id) : api.series(id)), `${kind}/${id}`);
  const [playing, setPlaying] = useState<string | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    setPlaying(null);
    setEpisode(null);
    window.scrollTo(0, 0);
  }, [id]);

  if (error) {
    const missing = (error as ApiError).status === 404;
    return <ErrorState title={missing ? "ERROR 404" : "ERROR"} message={missing ? "Este título no está en el catálogo" : error.message} onRetry={missing ? undefined : retry} />;
  }
  if (!title) return <div className="sheet animate-pulse" />;

  const play = (t: Title, ep?: Episode) => {
    const chosen = t.type === "SERIES" ? (ep ?? t.episodes[0]) : null;
    setEpisode(chosen);
    setPlaying(t.type === "MOVIE" ? t.video : chosen!.video);
    api.play(t.type, t.id).catch(() => undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const related = all.filter((t) => t.category === title.category && t.id !== title.id);

  return (
    <div className="sheet !bg-transparent">
      <div className="relative overflow-hidden rounded-t-[50px] bg-black">
        <div className="aspect-video max-h-[78svh] w-full">
          {playing ? (
            <iframe
              key={playing}
              src={embedUrl(playing)}
              title={episode ? `${title.name}: ${episode.name}` : title.name}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img src={title.backdrop} alt="" className="h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button type="button" onClick={() => play(title)} className="rounded-[14px] bg-[darkred] px-10 py-[14px] text-[18px] font-bold text-white transition hover:bg-wine-dark md:w-[20%]">
                  PLAY
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-black/75 px-5 py-4 text-white md:px-10 md:py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold md:text-[34px]">{title.name}</h2>
            {title.originalName && title.originalName !== title.name ? (
              <p className="text-[15px] font-light text-mist">{title.originalName} · {title.year}</p>
            ) : (
              <p className="text-[15px] font-light text-mist">{title.year}</p>
            )}
          </div>
          <HeartButton title={title} />
        </div>
        {episode ? <p className="mt-3 text-[16px] text-mist">Viendo: episodio {episode.number}, {episode.name}</p> : null}
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-[16px] sm:grid-cols-[auto_1fr]">
          <dt className="font-bold">Duración</dt>
          <dd>{title.type === "MOVIE" ? runtime(title.duration) : `${title.episodes.length} episodios`}</dd>
          <dt className="font-bold">Actores</dt>
          <dd>{title.cast.join(", ")}</dd>
          <dt className="font-bold">{title.type === "MOVIE" ? "Director" : "Creador"}</dt>
          <dd>{title.type === "MOVIE" ? title.director : title.creator}</dd>
          <dt className="font-bold">Clasificación</dt>
          <dd className="uppercase">{title.classification}</dd>
        </dl>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed font-light">{title.description}</p>
        <p className="mt-4 text-[13px] font-light text-dim">
          {title.views.toLocaleString("es")} reproducciones · Copia de dominio público servida por{" "}
          <a className="underline hover:text-white" href={`https://archive.org/details/${playing ?? (title.type === "MOVIE" ? title.video : title.episodes[0].video)}`} target="_blank" rel="noreferrer">
            Internet Archive
          </a>
        </p>
      </div>

      <div className="bg-sheet pt-8 pb-12">
        {title.type === "SERIES" ? (
          <section className="px-[30px] lg:px-[5%]" aria-labelledby="episodios">
            <h3 id="episodios" className="mb-3 text-[24px] font-light">Episodios</h3>
            <ol className="flex flex-col gap-3">
              {title.episodes.map((ep) => {
                const current = playing && episode?.number === ep.number;
                return (
                  <li key={ep.number}>
                    <button
                      type="button"
                      onClick={() => play(title, ep)}
                      aria-current={current ? "true" : undefined}
                      className={`flex w-full items-center gap-4 rounded-[14px] px-5 py-4 text-left transition-colors ${current ? "bg-wine text-white" : "bg-field hover:bg-[#2d2d2d]"}`}
                    >
                      <span className="w-8 text-[22px] font-bold">{ep.number}</span>
                      <span className="flex-1">
                        <span className="block font-bold text-white">{ep.name}</span>
                        <span className="text-[14px] font-light">{ep.year}</span>
                      </span>
                      <span className="text-[14px]">{runtime(ep.duration)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}
        <div className="mt-6 lg:px-[5%]">
          <Row title="También te puede gustar" titles={related} />
        </div>
      </div>
    </div>
  );
}
