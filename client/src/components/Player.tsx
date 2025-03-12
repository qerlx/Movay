import { type Movie } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";

interface PlayerProps {
  movie: Movie;
}

declare global {
  interface Window {
    Playerjs: any;
  }
}

export function Player({ movie }: PlayerProps) {
  const [, setLocation] = useLocation();
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPlayer = async () => {
      try {
        // Get stream URL from moviesapi.club
        const response = await fetch(`https://moviesapi.club/movie/${movie.tmdbId}`);
        if (!response.ok) {
          throw new Error('Failed to get stream URL');
        }
        const data = await response.json();

        if (playerContainerRef.current && window.Playerjs) {
          playerRef.current = new window.Playerjs({
            id: "player",
            file: data.url, // Use the stream URL from moviesapi.club
            poster: `https://image.tmdb.org/t/p/original${movie.backdropPath}`,
          });
        }
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.api('destroy');
      }
    };
  }, [movie]);

  return (
    <div className="relative h-screen bg-black">
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="aspect-video w-full max-w-7xl">
          <div 
            ref={playerContainerRef}
            id="player" 
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}