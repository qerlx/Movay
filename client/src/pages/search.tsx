import { useQuery } from "@tanstack/react-query";
import { type TMDBMovie } from "@shared/schema";
import { MovieGrid } from "@/components/MovieGrid";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split("?")[1]).get("q") || "";

  const { data: movies, isLoading } = useQuery<TMDBMovie[]>({
    queryKey: [`/api/movies/search?q=${query}`],
    enabled: query.length > 0,
  });

  useEffect(() => {
    document.title = `Search: ${query} - NetflixClone`;
  }, [query]);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Please enter a search term</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      </div>
    );
  }

  if (!movies?.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-8">Search results for "{query}"</h1>
      <MovieGrid movies={movies} />
    </div>
  );
}
