import { useQuery } from "@tanstack/react-query";
import { type Movie } from "@shared/schema";
import { Player } from "@/components/Player";

export default function WatchPage({ params }: { params: { id: string } }) {
  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: [`/api/movies/${params.id}`],
  });

  if (isLoading) {
    return <div className="h-screen bg-black" />;
  }

  if (!movie) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  return <Player movie={movie} />;
}
