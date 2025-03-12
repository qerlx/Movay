import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type TVShow } from "@shared/schema";
import { TVPlayer } from "@/components/TVPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TVShowPage() {
  const { id } = useParams<{ id: string }>();
  const { data: show, isLoading } = useQuery<TVShow>({
    queryKey: [`/api/tv/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!show) {
    return (
      <Card className="mx-auto my-8 max-w-lg">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold text-red-500">TV Show Not Found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't find the TV show you're looking for. It might have been removed or the ID is incorrect.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <TVPlayer show={show} />;
}
