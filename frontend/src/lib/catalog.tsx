import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import type { Home, Title } from "./types";

interface CatalogValue {
  data: Home | null;
  error: Error | null;
  retry: () => void;
  /** Movies and series together, for filtering by category or showing related titles. */
  all: Title[];
}

const CatalogContext = createContext<CatalogValue | null>(null);

/** The catalogue is loaded once per visit and shared by the menu and every page. */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Home | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setError(null);
    api.home().then(
      (home) => alive && setData(home),
      (err: Error) => alive && setError(err),
    );
    return () => {
      alive = false;
    };
  }, [attempt]);

  const all = data ? [...data.movies, ...data.series] : [];
  return (
    <CatalogContext.Provider value={{ data, error, retry: () => setAttempt((n) => n + 1), all }}>
      {children}
    </CatalogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog debe usarse dentro de <CatalogProvider>");
  return value;
}
