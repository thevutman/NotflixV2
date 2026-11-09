import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-cream/10">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 text-sm sm:px-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="text-3xl" />
          <p className="mt-4 max-w-sm text-dim">
            Nació en 2022 como proyecto final del ciclo 4 de Misión TIC. Lo lideró Santiago Velasco con la ayuda de su
            equipo, y en 2026 se renovó por completo: Spring Boot 3, MongoDB Atlas y React.
          </p>
        </div>
        <div>
          <p className="font-semibold">Explorar</p>
          <ul className="mt-4 space-y-2 text-dim">
            <li><Link to="/categoria/terror" className="hover:text-cream">Terror</Link></li>
            <li><Link to="/categoria/comedia" className="hover:text-cream">Comedia</Link></li>
            <li><Link to="/categoria/cine-negro" className="hover:text-cream">Cine negro</Link></li>
            <li><Link to="/categoria/grandes-clasicos" className="hover:text-cream">Grandes clásicos</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">0 % piratas</p>
          <p className="mt-4 text-dim">
            Todas las películas son de dominio público y se reproducen desde{" "}
            <a href="https://archive.org" target="_blank" rel="noreferrer" className="underline hover:text-cream">Internet Archive</a>.
            Los afiches vienen de{" "}
            <a href="https://commons.wikimedia.org" target="_blank" rel="noreferrer" className="underline hover:text-cream">Wikimedia Commons</a>.
          </p>
          <a href="https://thevutman.github.io" className="mt-4 inline-block text-cream underline-offset-4 hover:underline">
            Portafolio de Santiago →
          </a>
        </div>
      </div>
    </footer>
  );
}
