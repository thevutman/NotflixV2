import { gsap } from "gsap";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import type { Title } from "@/lib/types";

/** The heart from the 2022 detail page, now saved for real. Without a session it sends you to sign in. */
export function HeartButton({ title, withLabel = false }: { title: Title; withLabel?: boolean }) {
  const { session, liked, toggleLike } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const icon = useRef<SVGSVGElement>(null);
  const [error, setError] = useState(false);
  const active = liked.has(title.id);

  const onClick = async () => {
    if (!session) {
      navigate("/entrar", { state: { from: location.pathname } });
      return;
    }
    if (!active && icon.current) {
      gsap.fromTo(icon.current, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: "back.out(4)" });
    }
    try {
      setError(false);
      await toggleLike(title);
    } catch {
      setError(true);
    }
  };

  const label = active ? "Quitar de Mi lista" : "Agregar a Mi lista";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={withLabel ? undefined : label}
      title={error ? "No se pudo guardar, inténtalo otra vez" : label}
      className={`btn btn-ghost ${withLabel ? "" : "!h-[50px] !w-[50px] !p-0"}`}
    >
      <svg
        ref={icon}
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={active ? "var(--color-signal)" : "none"}
        stroke={active ? "var(--color-signal)" : "currentColor"}
        strokeWidth="2"
      >
        <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 3.8 4.4 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
      {withLabel ? label : null}
    </button>
  );
}
