import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import type { Category } from "@/lib/types";

/**
 * INICIO · CATEGORIAS · CUENTA, as in 2022. On desktop the dropdowns open under each word;
 * on a phone "MENU" slides the rounded panel in from the right. Search is the one addition.
 */
export function Menu({ categories }: { categories: Category[] }) {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState<"categorias" | "cuenta" | null>(null);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobile(false);
    setOpen(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const toggle = (which: "categorias" | "cuenta") => setOpen((o) => (o === which ? null : which));

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/buscar?q=${encodeURIComponent(q)}`);
  };

  const logOut = () => {
    signOut();
    navigate("/");
  };

  const items = (suffix: string) => (
    <>
      <NavLink to="/home/all" className={linkClass}>
        INICIO
      </NavLink>

      <div className="relative">
        <button type="button" className={linkClass({ isActive: open === "categorias" })} aria-expanded={open === "categorias"} onClick={() => toggle("categorias")}>
          CATEGORIAS
        </button>
        <Dropdown open={open === "categorias"} className="md:left-1/2 md:w-56 md:-translate-x-1/2">
          {categories.map((c) => (
            <NavLink key={c.id} to={`/home/${c.slug}`} className={dropLinkClass}>
              {c.name}
            </NavLink>
          ))}
        </Dropdown>
      </div>

      <form onSubmit={search} role="search" className="w-full max-w-[260px] md:w-auto">
        <label className="sr-only" htmlFor={`buscar-${suffix}`}>Buscar</label>
        <input
          id={`buscar-${suffix}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas, actores…"
          className="field !h-9 text-center text-sm md:w-56 md:text-left"
        />
      </form>

      <div className="relative">
        <button type="button" className={linkClass({ isActive: open === "cuenta" })} aria-expanded={open === "cuenta"} onClick={() => toggle("cuenta")}>
          CUENTA
        </button>
        <Dropdown open={open === "cuenta"} className="md:right-0 md:w-60">
          <p className="text-[22px] font-extrabold normal-case text-white">Hola{session ? `, ${session.name.split(" ")[0]}` : ""}</p>
          <NavLink to="/account" className={dropLinkClass}>Mis datos personales</NavLink>
          <NavLink to="/mi-lista" className={dropLinkClass}>Mi lista</NavLink>
          <button type="button" onClick={logOut} className="text-[16px] uppercase transition-colors hover:text-red-500">
            Cerrar sesión
          </button>
        </Dropdown>
      </div>
    </>
  );

  return (
    <nav ref={root} className="relative mb-4 overflow-x-clip md:overflow-visible" aria-label="Principal">
      <button type="button" className="mx-auto block text-[25px] font-bold text-white md:hidden" aria-expanded={mobile} onClick={() => setMobile((m) => !m)}>
        MENU
      </button>
      {/* Desktop row */}
      <div className="hidden items-center justify-around px-4 md:flex">{items("desktop")}</div>
      {/* Phone panel, slides in from the right like the original */}
      <div
        className={`absolute top-12 z-30 flex w-full flex-col items-center gap-6 rounded-[50px] bg-sheet px-6 py-12 transition-[left] duration-300 md:hidden ${
          mobile ? "left-0" : "left-full"
        }`}
        aria-hidden={!mobile}
        inert={!mobile}
      >
        {items("mobile")}
      </div>
    </nav>
  );
}

function linkClass({ isActive }: { isActive: boolean }) {
  return `text-[18px] uppercase transition-colors ${isActive ? "text-dim" : "text-white hover:text-dim"}`;
}

function dropLinkClass({ isActive }: { isActive: boolean }) {
  return `text-[16px] uppercase transition-colors ${isActive ? "text-white" : "text-mist hover:text-dim"}`;
}

function Dropdown({ open, className, children }: { open: boolean; className: string; children: ReactNode }) {
  return (
    <div
      className={`mt-3 flex flex-col items-center gap-3 text-center font-light uppercase transition duration-300 md:absolute md:z-20 md:mt-3 md:rounded-[14px] md:bg-frame md:px-5 md:py-6 md:font-normal md:shadow-2xl ${className} ${
        open ? "visible translate-y-0 opacity-100" : "invisible h-0 -translate-y-5 opacity-0 md:h-auto"
      }`}
    >
      {children}
    </div>
  );
}
