import { type Movie } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface PlayerProps {
  movie: Movie;
}

export function Player({ movie }: PlayerProps) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<{ url: string } | null>(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/movies/stream/${movie.tmdbId}`);
        if (!response.ok) {
          throw new Error('Failed to load movie stream');
        }
        const data = await response.json();
        setStreamData(data);
      } catch (err) {
        setError('Unable to load movie stream. Please try again later.');
        console.error('Stream error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [movie.tmdbId]);

  return (
    <div className="relative min-h-screen bg-black">
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="absolute inset-0 flex items-center justify-center">
        {loading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            <p className="text-muted-foreground mt-2">Loading movie stream...</p>
          </div>
        ) : error ? (
          <div className="text-center max-w-md mx-auto p-4">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : streamData ? (
          <div className="w-full h-full">
            <video 
              src={streamData.url}
              controls
              autoPlay
              className="w-full h-full"
              poster={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
            >
              Your browser doesn't support video playback.
            </video>
          </div>
        ) : null}
      </div>
    </div>
  );
}