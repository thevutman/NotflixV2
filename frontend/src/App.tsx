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
      <WakeNotice />
    </>
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
