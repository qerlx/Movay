import { type Movie } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface PlayerProps {
  movie: Movie;
}

export function Player({ movie }: PlayerProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="relative h-screen bg-black">
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="aspect-video w-full max-w-7xl bg-muted">
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              This is a mock player for {movie.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
