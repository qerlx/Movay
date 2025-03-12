import { useQuery } from "@tanstack/react-query";
import { type Movie } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoviePage({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: [`/api/movies/${params.id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <Skeleton className="w-full aspect-video" />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdropPath}`;

  return (
    <div className="min-h-screen pt-16">
      <div 
        className="w-full aspect-video bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-muted-foreground mt-4">{movie.overview}</p>
          
          <div className="mt-8">
            <Button 
              size="lg"
              onClick={() => setLocation(`/watch/${movie.id}`)}
            >
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
