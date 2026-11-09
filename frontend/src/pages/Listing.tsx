import { useSearchParams } from "react-router-dom";
import { ErrorState } from "@/components/Feedback";
import { Card } from "@/components/Row";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Title } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";

function Grid({ titles }: { titles: Title[] }) {
  return (
    <ul className="mt-8 flex flex-wrap justify-center gap-[26px]">
      {titles.map((t) => (
        <li key={t.id}>
          <Card title={t} />
        </li>
      ))}
    </ul>
  );
}

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const { data, error, retry } = useAsync(() => (q ? api.search(q) : Promise.resolve({ movies: [], series: [] })), q);
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  const results = data ? [...data.movies, ...data.series] : [];
  return (
    <div className="sheet px-[26px] py-[38px] lg:px-[5%]">
      <h2 className="page-title">Resultados para «{q}»</h2>
      {data && !results.length ? (
        <p className="mt-8 text-center text-[16px] font-light">No encontramos nada. Prueba con un actor como Keaton o un director como Murnau.</p>
      ) : (
        <Grid titles={results} />
      )}
    </div>
  );
}

export function MyListPage() {
  const { myList } = useAuth();
  return (
    <div className="sheet px-[26px] py-[38px] lg:px-[5%]">
      <h2 className="page-title">Mi lista</h2>
      {myList.length ? (
        <Grid titles={myList} />
      ) : (
        <p className="mt-8 text-center text-[16px] font-light">Todavía está vacía. Toca el corazón en cualquier película o serie y aparecerá aquí.</p>
      )}
    </div>
  );
}

export function NotFound() {
  return (
    <div className="sheet">
      <ErrorState title="ERROR 404" message="Page Not Found" />
    </div>
  );
}
