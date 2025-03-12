import { type Movie } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPlayer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get stream URL from our backend
        const response = await fetch(`/api/movies/stream/${movie.tmdbId}`);
        if (!response.ok) {
          throw new Error('Failed to get stream URL');
        }
        const data = await response.json();

        if (playerContainerRef.current && window.Playerjs) {
          playerRef.current = new window.Playerjs({
            id: "player",
            file: data.url,
            poster: `https://image.tmdb.org/t/p/original${movie.backdropPath}`,
          });
        }
      } catch (error) {
        console.error('Error initializing player:', error);
        setError('Failed to load video player');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load video player. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.api('destroy');
      }
    };
  }, [movie, toast]);

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
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-primary">Loading...</div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-destructive">{error}</div>
            </div>
          ) : (
            <div 
              ref={playerContainerRef}
              id="player" 
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}