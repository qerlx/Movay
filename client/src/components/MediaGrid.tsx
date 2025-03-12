import { type Movie, type TVShow } from "@shared/schema";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Tv, Film } from "lucide-react";

interface MediaGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
}

export function MediaGrid({ items, type }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/${type}/${item.id}`}
          className="transform transition-all duration-300 hover:scale-105"
        >
          <Card className="relative group overflow-hidden rounded-xl bg-[#1a1a2e] border-indigo-600/20">
            {item.posterPath ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                alt={item.title}
                className="aspect-[2/3] object-cover w-full"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[2/3] flex items-center justify-center bg-[#0a0a14]">
                {type === 'tv' ? (
                  <Tv className="w-12 h-12 text-indigo-400/50" />
                ) : (
                  <Film className="w-12 h-12 text-indigo-400/50" />
                )}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-sm font-semibold line-clamp-2 text-white">
                {item.title}
              </h3>
              {'releaseDate' in item ? (
                <p className="text-xs text-indigo-400 mt-1">
                  {new Date(item.releaseDate).getFullYear()}
                </p>
              ) : (
                <p className="text-xs text-indigo-400 mt-1">
                  {new Date(item.firstAirDate).getFullYear()}
                </p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
