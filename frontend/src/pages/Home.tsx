import { useParams } from "react-router-dom";
import { ErrorState } from "@/components/Feedback";
import { Row } from "@/components/Row";
import { useAuth } from "@/lib/auth";
import { useCatalog } from "@/lib/catalog";

/**
 * The 2022 "MoviesContainer": a centred title and two shelves, Películas and Series.
 * /home/all is the start page; /home/{categoría} filters both shelves, as before.
 */
export function Home() {
  const { name = "all" } = useParams();
  const { data, error, retry } = useCatalog();
  const { myList } = useAuth();

  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (!data) return <Skeleton />;

  const category = data.categories.find((c) => c.slug === name);
  if (name !== "all" && !category) return <ErrorState title="ERROR 404" message="Esa categoría no existe" />;

  const inCategory = <T extends { category: string }>(list: T[]) => (category ? list.filter((t) => t.category === category.slug) : list);
  const mostWatched = [...data.movies, ...data.series].filter((t) => t.views > 0).sort((a, b) => b.views - a.views).slice(0, 10);

  return (
    <div className="sheet flex flex-col gap-2 px-[26px] py-[26px] lg:px-[5%] lg:py-[38px]">
      <h2 className="page-title">{category ? category.name : "Inicio"}</h2>
      {category ? <p className="text-center text-[15px] font-light">{category.description}</p> : null}

      {!category && myList.length ? <Row title="Mi lista" titles={myList} /> : null}
      <Row title="Películas" titles={inCategory(data.movies)} empty="No hay películas en esta categoría." />
      <Row title="Series" titles={inCategory(data.series)} empty="No hay series en esta categoría." />
      {!category && mostWatched.length ? <Row title="Lo más visto" titles={mostWatched} /> : null}
      {!category
        ? data.categories.map((c) => (
            <Row key={c.id} title={c.name} titles={[...data.movies, ...data.series].filter((t) => t.category === c.slug)} />
          ))
        : null}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="sheet px-[26px] py-[26px] lg:px-[5%]" aria-busy="true">
      <div className="mx-auto h-7 w-32 animate-pulse rounded bg-field" />
      {[0, 1].map((r) => (
        <div key={r} className="mt-8 px-[30px]">
          <div className="h-6 w-28 animate-pulse rounded bg-field" />
          <div className="mt-5 flex gap-[26px] overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-[120px] w-[176px] shrink-0 animate-pulse rounded-[14px] bg-field md:h-[133px] md:w-[220px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
