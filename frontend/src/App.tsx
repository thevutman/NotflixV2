import { useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { WakeNotice } from "@/components/Feedback";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { AuthProvider, useAuth } from "@/lib/auth";
import { CatalogProvider, useCatalog } from "@/lib/catalog";
import { Account } from "@/pages/Account";
import { Login, Register } from "@/pages/Auth";
import { Detail } from "@/pages/Detail";
import { Home } from "@/pages/Home";
import { MyListPage, NotFound, SearchPage } from "@/pages/Listing";

/** Same two layouts as 2022: Layout (header only) for login and register, MenuLayout for the rest. */
function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Credits />
      <WakeNotice />
    </>
  );
}

const team = [
  { user: "Mriosp02", name: "Marcela Ríos P" },
  { user: "savendanog", name: "savendanog" },
  { user: "dannyshernandezg", name: "dannyshernandezg" },
];

const gh = (user: string, name: string) => (
  <a href={`https://github.com/${user}`} target="_blank" rel="noreferrer" className="text-mist underline-offset-2 hover:underline">
    {name}
  </a>
);

/** Who made it, on every page: led by Santiago with the help of the 2022 team. */
function Credits() {
  return (
    <footer className="bg-sheet px-6 pt-4 pb-8 text-center text-[13px] font-light text-dim">
      Proyecto final del ciclo 4 de Misión TIC 2022, liderado por {gh("thevutman", "Santiago Velasco")} con la ayuda de{" "}
      {team.map((m, i) => (
        <span key={m.user}>
          {gh(m.user, m.name)}
          {i < team.length - 2 ? ", " : i === team.length - 2 ? " y " : ""}
        </span>
      ))}
      . Renovado en 2026. Películas de dominio público vía Internet Archive.
    </footer>
  );
}

function MenuLayout() {
  const { session } = useAuth();
  const { data } = useCatalog();
  const location = useLocation();
  // As in the original, the catalogue is behind the login (the guest button makes that one click).
  if (!session) return <Navigate to="/" state={{ from: location.pathname + location.search }} replace />;
  return (
    <>
      <Menu categories={data?.categories ?? []} />
      <Outlet />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route element={<MenuLayout />}>
                <Route path="home/:name" element={<Home />} />
                <Route path="movies/:id" element={<Detail kind="movies" />} />
                <Route path="series/:id" element={<Detail kind="series" />} />
                <Route path="account" element={<Account />} />
                <Route path="mi-lista" element={<MyListPage />} />
                <Route path="buscar" element={<SearchPage />} />
                <Route path="home" element={<Navigate to="/home/all" replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
