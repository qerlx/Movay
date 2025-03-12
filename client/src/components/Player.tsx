import { type Movie } from "@shared/schema";
import { ArrowLeft, Heart, Share2, Volume2, VolumeX } from "lucide-react";
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

  return (
    <div className="relative min-h-screen bg-black">
      {/* Back button */}
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      {/* Video iframe */}
      <div className="absolute inset-0">
        <iframe
          src={`https://embed.su/embed/movie/${movie.tmdbId}`}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`${
                isLiked ? "text-red-500" : "text-white"
              } hover:bg-white/20`}
            >
              <Heart className={isLiked ? "fill-current" : ""} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigator.share?.({
                  title: movie.title,
                  text: movie.overview,
                  url: window.location.href,
                });
              }}
              className="text-white hover:bg-white/20"
            >
              <Share2 />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}