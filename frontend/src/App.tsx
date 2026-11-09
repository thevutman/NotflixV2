import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { WakeNotice } from "@/components/Feedback";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth";
import { Account } from "@/pages/Account";
import { Login, Register } from "@/pages/Auth";
import { Detail } from "@/pages/Detail";
import { Home } from "@/pages/Home";
import { CategoryPage, MyListPage, NotFound, SearchPage } from "@/pages/Listing";

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="grain">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WakeNotice />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="pelicula/:slug" element={<Detail kind="pelicula" />} />
            <Route path="serie/:slug" element={<Detail kind="serie" />} />
            <Route path="categoria/:slug" element={<CategoryPage />} />
            <Route path="buscar" element={<SearchPage />} />
            <Route path="mi-lista" element={<MyListPage />} />
            <Route path="cuenta" element={<Account />} />
            <Route path="entrar" element={<Login />} />
            <Route path="registro" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
