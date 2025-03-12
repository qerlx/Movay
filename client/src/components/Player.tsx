import { type Movie } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface PlayerProps {
  movie: Movie;
}

declare global {
  interface Window {
    Playerjs: any;
    PlayerjsAsync: () => void;
  }
}

export function Player({ movie }: PlayerProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Define async player initialization
    window.PlayerjsAsync = () => {
      new window.Playerjs({
        id: "player",
        file: `/api/movies/watch/${movie.tmdbId}`,
        poster: `https://image.tmdb.org/t/p/original${movie.backdropPath}`,
        title: movie.title,
        autoplay: 1,
        volume: 100,
      });
    };
  }, [movie]);

  return (
    <div className="relative min-h-screen bg-black">
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="absolute inset-0 flex items-center justify-center">
        <div id="player" className="w-full h-full" />
      </div>
    </div>
  );
}