import { type Movie } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface PlayerProps {
  movie: Movie;
}

export function Player({ movie }: PlayerProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen bg-black">
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="absolute inset-0">
        <iframe 
          src={`/api/movies/watch/${movie.tmdbId}`}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}