import { useQuery } from "@tanstack/react-query";
import { type Movie } from "@shared/schema";
import { Player } from "@/components/Player";
import { Skeleton } from "@/components/ui/skeleton";

export default function WatchPage() {
  const movieId = window.location.pathname.split("/watch/")[1];

  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: [`/api/movies/${movieId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Skeleton className="w-full h-screen" />
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

  return <Player movie={movie} />;
}