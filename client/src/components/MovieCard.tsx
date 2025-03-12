import { type Movie } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [, setLocation] = useLocation();
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.posterPath}`;
  
  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-transform hover:scale-105"
      onClick={() => setLocation(`/movie/${movie.id}`)}
    >
      <CardContent className="p-0 aspect-[2/3] relative">
        <img 
          src={imageUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <h3 className="font-semibold text-sm line-clamp-1">{movie.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{movie.releaseDate?.split("-")[0]}</p>
        </div>
      </CardContent>
    </Card>
  );
}
