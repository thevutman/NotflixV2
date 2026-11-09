import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

/** The 2022 header: the patched logo, a thin white divider and BIENVENIDO. */
export function Header() {
  return (
    <header className="flex items-center justify-center gap-4 px-3 py-4 sm:gap-5">
      <Link to="/home/all" aria-label="Notflix, ir al inicio">
        <img src={logo} alt="Notflix" className="w-[35vw] max-w-[200px] object-cover min-[992px]:w-[10vw]" />
      </Link>
      <span aria-hidden="true" className="h-[4vh] w-[2px] bg-white" />
      <p className="text-[27px] font-extrabold text-white [text-shadow:rgba(0,0,0,0.25)_0_17px_4px]">BIENVENIDO</p>
    </header>
  );
}
