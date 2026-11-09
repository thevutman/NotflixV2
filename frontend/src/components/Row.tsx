import { useRef } from "react";
import { Link } from "react-router-dom";
import fallback from "@/assets/pelicula.jpg";
import { titlePath } from "@/lib/api";
import type { Title } from "@/lib/types";

/**
 * "Cajitas": the 2022 shelf of landscape cards with rounded corners, a soft light shadow,
 * a zoom on hover and the grey round arrows on both sides.
 */
export function Row({ title, titles, empty }: { title: string; titles: Title[]; empty?: string }) {
  const shelf = useRef<HTMLUListElement>(null);
  const move = (dir: 1 | -1) => shelf.current?.scrollBy({ left: dir * 400 });

  return (
    <section className="relative px-[30px]" aria-label={title}>
      <h3 className="mt-2 mb-3 text-[24px] font-light">{title}</h3>
      {titles.length ? (
        <div className="relative">
          <ul ref={shelf} className="cajitas flex items-center gap-[26px] overflow-x-auto py-4">
            {titles.map((t) => (
              <li key={t.id} className="shrink-0 snap-center">
                <Card title={t} />
              </li>
            ))}
          </ul>
          <button type="button" className="row-arrow -left-[15px] xl:-left-[35px]" aria-label={`Anteriores en ${title}`} onClick={() => move(-1)}>
            ‹
          </button>
          <button type="button" className="row-arrow -right-[15px] xl:-right-[35px]" aria-label={`Siguientes en ${title}`} onClick={() => move(1)}>
            ›
          </button>
        </div>
      ) : (
        <p className="py-6 text-[15px] font-light text-dim">{empty ?? "No hay títulos aquí todavía."}</p>
      )}
    </section>
  );
}

export function Card({ title }: { title: Title }) {
  return (
    <Link
      to={titlePath(title)}
      className="group relative block transition-transform duration-300 ease-out hover:scale-110 focus-visible:scale-110"
      aria-label={`${title.name} (${title.year})`}
    >
      <img
        src={title.backdrop || fallback}
        onError={(e) => (e.currentTarget.src = fallback)}
        alt=""
        loading="lazy"
        className="h-[120px] w-[176px] rounded-[14px] object-cover shadow-[rgba(255,245,245,0.25)_5px_8px_10px] md:h-[133px] md:w-[220px]"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[14px] bg-gradient-to-t from-black/90 to-transparent px-3 pt-6 pb-2 text-[13px] leading-tight font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        {title.name}
      </span>
    </Link>
  );
}
