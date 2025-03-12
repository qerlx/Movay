import { useQuery } from "@tanstack/react-query";
import { type Movie } from "@shared/schema";
import { MovieHero } from "@/components/MovieHero";
import { MediaGrid } from "@/components/MediaGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function Home() {
  const { data: moviesData, isLoading } = useQuery<{
    results: Movie[];
    page: number;
    total_pages: number;
  }>({
    queryKey: ["/api/movies/popular"],
  });

  useEffect(() => {
    document.title = "MovieStreamHub";
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="w-full h-[80vh]" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!moviesData?.results?.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No movies found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MovieHero movie={moviesData.results[0]} />
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Popular Movies</h2>
        <MediaGrid 
          items={moviesData.results} 
          type="movie"
          hasMore={moviesData.page < moviesData.total_pages}
        />
      </div>
    </div>
  );
}