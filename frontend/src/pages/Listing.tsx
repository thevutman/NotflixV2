import { Link, useParams, useSearchParams } from "react-router-dom";
import { ErrorState } from "@/components/Feedback";
import { TitleCard } from "@/components/TitleCard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Title } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";

function Grid({ titles }: { titles: Title[] }) {
  return (
    <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {titles.map((t) => (
        <li key={t.id}>
          <TitleCard title={t} />
        </li>
      ))}
    </ul>
  );
}

function Page({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-[80svh] max-w-[1600px] px-4 pt-28 pb-20 sm:px-10 sm:pt-36">
      <p className="text-xs font-semibold tracking-[0.2em] text-signal uppercase">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-[clamp(44px,7vw,96px)] leading-[0.95]">{title}</h1>
      {intro ? <p className="mt-4 max-w-xl text-mist/80">{intro}</p> : null}
      {children}
    </div>
  );
}

export function CategoryPage() {
  const { slug = "" } = useParams();
  const { data, error, retry } = useAsync(api.home, "home");
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (!data) return <Page eyebrow="Categoría" title="Cargando…">{null}</Page>;
  const category = data.categories.find((c) => c.slug === slug);
  if (!category) return <ErrorState message="Esa categoría no existe." />;
  const titles = [...data.movies, ...data.series].filter((t) => t.category === slug);
  return (
    <Page eyebrow="Categoría" title={category.name} intro={category.description}>
      <Grid titles={titles} />
    </Page>
  );
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const { data, error, retry } = useAsync(() => (q ? api.search(q) : Promise.resolve({ movies: [], series: [] })), q);
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  const results = data ? [...data.movies, ...data.series] : [];
  return (
    <Page eyebrow="Búsqueda" title={q ? `«${q}»` : "Buscar"}>
      {data && !results.length ? (
        <p className="mt-10 text-dim">
          No encontramos nada con «{q}». Prueba con un actor (Keaton, Chaplin) o un director (Murnau).
        </p>
      ) : (
        <Grid titles={results} />
      )}
    </Page>
  );
}

export function MyListPage() {
  const { session, myList } = useAuth();
  if (!session) {
    return (
      <Page eyebrow="Mi lista" title="Tus favoritos, en un solo lugar">
        <p className="mt-6 max-w-md text-mist/80">Inicia sesión y toca el corazón en cualquier título para guardarlo aquí.</p>
        <Link to="/entrar" state={{ from: "/mi-lista" }} className="btn btn-primary mt-8">
          Iniciar sesión
        </Link>
      </Page>
    );
  }
  return (
    <Page eyebrow="Mi lista" title={`La lista de ${session.name.split(" ")[0]}`}>
      {myList.length ? (
        <Grid titles={myList} />
      ) : (
        <p className="mt-6 max-w-md text-mist/80">
          Todavía está vacía. Toca el corazón en cualquier película o serie y aparecerá aquí.
        </p>
      )}
    </Page>
  );
}

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-[clamp(120px,22vw,280px)] leading-none text-signal">404</p>
      <p className="font-serif text-4xl">Esta escena se quedó en la sala de montaje</p>
      <Link to="/" className="btn btn-primary mt-10">Volver al inicio</Link>
    </div>
  );
}
