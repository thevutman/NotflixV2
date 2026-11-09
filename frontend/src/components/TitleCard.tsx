import { Link } from "react-router-dom";
import { runtime, titlePath } from "@/lib/api";
import type { Title } from "@/lib/types";

export function TitleCard({ title, rank }: { title: Title; rank?: number }) {
  const meta = title.type === "MOVIE" ? runtime(title.duration) : `${title.episodes.length} episodios`;
  return (
    <Link
      to={titlePath(title)}
      className="group relative block shrink-0 snap-start"
      aria-label={`${title.name} (${title.year})`}
    >
      {rank ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-3 -left-3 z-10 font-serif text-[110px] leading-none text-ink [-webkit-text-stroke:2px_var(--color-cream)]"
        >
          {rank}
        </span>
      ) : null}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-coal">
        <img
          src={title.poster}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover grayscale-[35%] transition duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm leading-tight font-semibold">{title.name}</p>
          <p className="mt-1 text-xs text-mist/70">
            {title.year} · {meta}
          </p>
        </div>
        {title.type === "SERIES" ? (
          <span className="absolute top-2 left-2 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase backdrop-blur">
            Serie
          </span>
        ) : null}
      </div>
    </Link>
  );
}
