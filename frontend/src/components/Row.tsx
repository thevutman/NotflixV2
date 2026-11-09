import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Title } from "@/lib/types";
import { TitleCard } from "./TitleCard";

/** A horizontal shelf of posters, the core of any streaming home. Arrows on desktop, swipe on touch. */
export function Row({ title, titles, href, ranked }: { title: string; titles: Title[]; href?: string; ranked?: boolean }) {
  const scroller = useRef<HTMLUListElement>(null);
  if (!titles.length) return null;

  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="group/row relative mt-10 sm:mt-14" aria-label={title}>
      <div className="mb-4 flex items-baseline justify-between px-4 sm:px-10">
        <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {href ? (
          <Link to={href} className="text-sm text-dim transition-colors hover:text-cream">
            Ver todo →
          </Link>
        ) : null}
      </div>
      <ul
        ref={scroller}
        className={`row-scroll flex overflow-x-auto px-4 pb-4 sm:px-10 ${ranked ? "gap-10 pl-8 sm:pl-16" : "gap-3 sm:gap-4"}`}
      >
        {titles.map((t, i) => (
          <li key={t.id} className={ranked ? "w-[140px] sm:w-[180px]" : "w-[130px] sm:w-[180px] lg:w-[200px]"}>
            <TitleCard title={t} rank={ranked ? i + 1 : undefined} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => page(-1)}
        aria-label={`Anteriores en ${title}`}
        className="absolute top-1/2 left-2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ink/80 text-xl opacity-0 backdrop-blur transition-opacity group-hover/row:opacity-100 sm:grid"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => page(1)}
        aria-label={`Siguientes en ${title}`}
        className="absolute top-1/2 right-2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ink/80 text-xl opacity-0 backdrop-blur transition-opacity group-hover/row:opacity-100 sm:grid"
      >
        ›
      </button>
    </section>
  );
}
