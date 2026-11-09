import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/categoria/terror", label: "Terror" },
  { to: "/categoria/comedia", label: "Comedia" },
  { to: "/mi-lista", label: "Mi lista" },
];

export function Navbar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [solid, setSolid] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/buscar?q=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? "bg-ink/90 backdrop-blur-md" : "bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 sm:h-20 sm:px-10">
        <Link to="/" className="text-2xl sm:text-[28px]">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "text-cream" : "text-dim hover:text-cream"}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <form onSubmit={search} role="search" className="ml-auto">
          <label className="group flex items-center gap-2 rounded-full border border-cream/10 bg-cream/5 px-4 py-2 transition-colors focus-within:border-cream/40">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-dim">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="sr-only">Buscar</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar títulos, actores…"
              className="w-28 bg-transparent text-sm placeholder:text-dim focus:outline-none sm:w-52"
            />
          </label>
        </form>

        {session ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-haspopup="menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-signal font-bold text-ink"
            >
              <span className="sr-only">Menú de la cuenta de </span>
              {session.name.charAt(0).toUpperCase()}
            </button>
            {menu ? (
              <div role="menu" className="absolute top-12 right-0 w-56 overflow-hidden rounded-2xl border border-cream/10 bg-coal p-2 shadow-2xl">
                <p className="truncate px-3 py-2 text-xs text-dim">{session.email}</p>
                <MenuLink to="/mi-lista" onClick={() => setMenu(false)}>Mi lista</MenuLink>
                <MenuLink to="/cuenta" onClick={() => setMenu(false)}>Mi cuenta</MenuLink>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    signOut();
                    navigate("/");
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-cream/10"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Link to="/entrar" className="btn btn-primary !px-5 !py-2.5 text-sm">
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}

function MenuLink({ to, onClick, children }: { to: string; onClick: () => void; children: string }) {
  return (
    <Link role="menuitem" to={to} onClick={onClick} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-cream/10">
      {children}
    </Link>
  );
}
