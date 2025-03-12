import { useQuery } from "@tanstack/react-query";
import { type Movie, type TVShow } from "@shared/schema";
import { MediaGrid } from "@/components/MediaGrid";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResults {
  movies: Movie[];
  tvShows: TVShow[];
}

export default function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split("?")[1]).get("q") || "";

  const { data: results, isLoading } = useQuery<SearchResults>({
    queryKey: [`/api/search?q=${query}`],
    enabled: query.length > 0,
  });

  useEffect(() => {
    document.title = `Search: ${query} - MovieStreamHub`;
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

  if (!results?.movies.length && !results?.tvShows.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        Search results for "{query}"
      </h1>

      {results.movies.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Movies</h2>
          <MediaGrid items={results.movies} type="movie" />
        </div>
      )}

      {results.tvShows.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-6">TV Shows</h2>
          <MediaGrid items={results.tvShows} type="tv" />
        </div>
      )}
    </div>
  );
}