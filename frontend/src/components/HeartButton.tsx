import { useState } from "react";
import { useAuth } from "@/lib/auth";
import type { Title } from "@/lib/types";

/** The heart from the 2022 info panel: white, red once the title is in "Mi lista". */
export function HeartButton({ title }: { title: Title }) {
  const { liked, toggleLike } = useAuth();
  const [error, setError] = useState(false);
  const active = liked.has(title.id);
  const label = active ? "Quitar de Mi lista" : "Agregar a Mi lista";

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={error ? "No se pudo guardar, inténtalo otra vez" : label}
      onClick={async () => {
        setError(false);
        try {
          await toggleLike(title);
        } catch {
          setError(true);
        }
      }}
      className="grid h-10 w-10 place-items-center transition-transform active:scale-75"
    >
      <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill={active ? "red" : "white"} className="transition-colors duration-300">
        <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 3.8 4.4 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
