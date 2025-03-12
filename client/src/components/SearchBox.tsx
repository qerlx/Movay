import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { type Movie, type TVShow } from "@shared/schema";

interface SearchResults {
  movies: Movie[];
  tvShows: TVShow[];
}

export function SearchBox() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isLoading } = useQuery<SearchResults>({
    queryKey: [`/api/movies/search?q=${query}`],
    enabled: query.length > 2,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={searchContainerRef} className="search-container relative w-80">
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search movies & shows..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyPress={handleKeyPress}
          onClick={() => setIsOpen(true)}
          className="pl-10 bg-[#1a1a2e]/50 border-indigo-600/20 focus:border-indigo-600 transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
      </div>

      {/* Live Search Results */}
      {isOpen && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#1a1a2e] rounded-lg shadow-[0_4px_20px_rgba(79,70,229,0.1)] border border-indigo-600/20 z-50 max-h-[70vh] overflow-y-auto animate-fade-in">
          {isLoading ? (
            <div className="p-4 text-center text-indigo-400">
              Searching...
            </div>
          ) : !results || (results.movies.length === 0 && results.tvShows.length === 0) ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <>
              {results.movies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-indigo-400 mb-2 px-2">Movies</h3>
                  {results.movies.map((movie) => (
                    <Card
                      key={movie.id}
                      className="p-2 mb-2 hover:bg-[#2a2a3e] cursor-pointer bg-[#1a1a2e] border-indigo-600/20 transition-all duration-300"
                      onClick={() => {
                        setLocation(`/movie/${movie.id}`);
                        setIsOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {movie.posterPath && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded"
                            loading="lazy"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-sm">{movie.title}</p>
                          {movie.releaseDate && (
                            <p className="text-xs text-indigo-400">
                              {new Date(movie.releaseDate).getFullYear()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {results.tvShows.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 mb-2 px-2">TV Shows</h3>
                  {results.tvShows.map((show) => (
                    <Card
                      key={show.id}
                      className="p-2 mb-2 hover:bg-[#2a2a3e] cursor-pointer bg-[#1a1a2e] border-indigo-600/20 transition-all duration-300"
                      onClick={() => {
                        setLocation(`/tv/${show.id}`);
                        setIsOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {show.posterPath && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${show.posterPath}`}
                            alt={show.title}
                            className="w-12 h-16 object-cover rounded"
                            loading="lazy"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-sm">{show.title}</p>
                          {show.firstAirDate && (
                            <p className="text-xs text-indigo-400">
                              {new Date(show.firstAirDate).getFullYear()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}