import { type Movie } from "@shared/schema";
import { ArrowLeft, Heart, Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface PlayerProps {
  movie: Movie;
}

export function Player({ movie }: PlayerProps) {
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    document.title = `Watch ${movie.title}`;
  }, [movie]);

  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Navigation */}
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="container mx-auto px-4 py-8">
        {/* Movie Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {posterUrl && (
            <div className="hidden md:block">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          )}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-400 mb-6">{movie.overview}</p>
            {movie.releaseDate && (
              <p className="text-indigo-400">Released: {new Date(movie.releaseDate).getFullYear()}</p>
            )}
          </div>
        </div>

        {/* Player Container */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={`https://embed.su/embed/movie/${movie.tmdbId}`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
          />

          {/* Bottom HUD */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a14]/90 to-transparent">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-[#1a1a2e]/50"
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`${
                  isLiked ? "text-indigo-400" : "text-white"
                } hover:bg-[#1a1a2e]/50`}
              >
                <Heart className={isLiked ? "fill-current" : ""} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}