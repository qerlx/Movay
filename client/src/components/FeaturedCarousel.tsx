import { type Movie } from "@shared/schema";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface FeaturedCarouselProps {
  movies: Movie[];
}

export function FeaturedCarousel({ movies }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
        setIsTransitioning(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/original${currentMovie.backdropPath}`;

  return (
    <div className="relative w-full aspect-[2.4/1] overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">
            {currentMovie.title}
          </h1>
          <p className="text-lg text-gray-300 line-clamp-3">
            {currentMovie.overview}
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => setLocation(`/watch/${currentMovie.id}`)}
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Play Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation(`/movie/${currentMovie.id}`)}
              className="border-white/20 hover:bg-white/10 transition-colors duration-300"
            >
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(i);
                setIsTransitioning(false);
              }, 500);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'bg-indigo-500 w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
