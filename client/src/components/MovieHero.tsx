import { type Movie } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import { useLocation } from "wouter";

interface MovieHeroProps {
  movie: Movie;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const [, setLocation] = useLocation();
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdropPath}`;

  return (
    <div className="relative h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/0" />
      </div>
      
      <div className="relative container mx-auto h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">{movie.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground line-clamp-3">{movie.overview}</p>
          
          <div className="flex gap-4 mt-8">
            <Button 
              size="lg" 
              onClick={() => setLocation(`/watch/${movie.id}`)}
            >
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setLocation(`/movie/${movie.id}`)}
            >
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
