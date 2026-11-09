import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { runtime, titlePath } from "@/lib/api";
import type { Title } from "@/lib/types";
import { HeartButton } from "./HeartButton";

const SLIDE_MS = 8000;

/** Featured titles take turns: the backdrop slowly pushes in, the text rises, a bar counts down. */
export function Hero({ titles }: { titles: Title[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLElement>(null);
  const title = titles[index];

  useEffect(() => {
    if (titles.length < 2 || paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % titles.length), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, titles.length]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-bg", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 2.4, ease: "expo.out" });
      gsap.from(".hero-in", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.15 });
    }, el);
    return () => ctx.revert();
  }, [index]);

  if (!title) return null;
  const meta = title.type === "MOVIE" ? runtime(title.duration) : `${title.episodes.length} episodios`;

  return (
    <section
      ref={root}
      className="relative h-[92svh] min-h-[600px] overflow-hidden sm:h-[86svh]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Destacados"
    >
      <img key={title.id} src={title.backdrop} alt="" className="hero-bg absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />

      <div key={`t-${title.id}`} className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-24 sm:px-10 sm:pb-28">
        <p className="hero-in mb-4 text-xs font-semibold tracking-[0.2em] text-signal uppercase">
          {title.type === "MOVIE" ? "Película" : "Serie"} · {title.year} · {title.country}
        </p>
        <h1 className="hero-in max-w-4xl font-serif text-[clamp(52px,9vw,140px)] leading-[0.88] tracking-tight">
          {title.name}
        </h1>
        <p className="hero-in mt-5 line-clamp-3 max-w-xl text-base leading-relaxed text-mist/85 sm:line-clamp-none sm:text-lg">{title.description}</p>
        <p className="hero-in mt-4 text-sm text-dim">
          <span className="mr-2 rounded border border-cream/30 px-1.5 py-0.5 text-xs text-cream">{title.classification}</span>
          {meta} · {title.type === "MOVIE" ? title.director : title.creator}
        </p>
        <div className="hero-in mt-8 flex flex-wrap items-center gap-3">
          <Link to={`${titlePath(title)}#ver`} className="btn btn-primary">
            <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M0 0v16l14-8z" /></svg>
            Reproducir
          </Link>
          <Link to={titlePath(title)} className="btn btn-ghost">
            Más información
          </Link>
          <HeartButton title={title} />
        </div>
      </div>

      {titles.length > 1 ? (
        <div className="absolute right-4 bottom-10 flex gap-2 sm:right-10">
          {titles.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver ${t.name}`}
              aria-current={i === index}
              className="relative h-1 w-10 overflow-hidden rounded-full bg-cream/20 sm:w-14"
            >
              {i === index ? (
                <span
                  key={`${index}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-cream"
                  style={{ animation: paused ? "none" : `hero-progress ${SLIDE_MS}ms linear forwards`, width: paused ? "100%" : 0 }}
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
      <style>{`@keyframes hero-progress { from { width: 0 } to { width: 100% } }`}</style>
    </section>
  );
}
