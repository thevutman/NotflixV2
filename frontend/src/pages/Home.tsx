import { useMemo } from "react";
import { ErrorState, PosterSkeleton } from "@/components/Feedback";
import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Title } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";

export function Home() {
  const { data, error, retry } = useAsync(api.home, "home");
  const { session, myList } = useAuth();

  const rows = useMemo(() => {
    if (!data) return [];
    const all: Title[] = [...data.movies, ...data.series];
    return data.categories.map((c) => ({ category: c, titles: all.filter((t) => t.category === c.slug) }));
  }, [data]);

  const mostWatched = useMemo(() => {
    if (!data) return [];
    return [...data.movies, ...data.series].sort((a, b) => b.views - a.views).slice(0, 10);
  }, [data]);

  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (!data) {
    return (
      <div className="pt-24">
        <div className="mx-4 h-[60svh] animate-pulse rounded-3xl bg-coal sm:mx-10" />
        <PosterSkeleton />
      </div>
    );
  }

  return (
    <>
      <Hero titles={data.featured} />
      <div className="relative z-10 -mt-16 pb-10">
        {session && myList.length ? <Row title="Mi lista" titles={myList} href="/mi-lista" /> : null}
        {mostWatched.some((t) => t.views > 0) ? <Row title="Lo más visto en Notflix" titles={mostWatched} ranked /> : null}
        <Row title="Series de cortos" titles={data.series} />
        {rows.map(({ category, titles }) => (
          <Row key={category.id} title={category.name} titles={titles} href={`/categoria/${category.slug}`} />
        ))}
      </div>
    </>
  );
}
