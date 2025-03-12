import { useQuery } from "@tanstack/react-query";
import { type TVShow } from "@shared/schema";
import { MediaGrid } from "@/components/MediaGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Categories } from "@/components/Categories";
import { useState, useEffect } from "react";

export default function TVShowsPage() {
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: tvShowsData, isLoading, isFetching } = useQuery<{
    results: TVShow[];
    page: number;
    total_pages: number;
  }>({
    queryKey: [`/api/tv/popular?page=${page}&genre=${selectedGenre || ''}`],
  });

  useEffect(() => {
    document.title = "TV Shows - MovieStreamHub";
  }, []);

  // Reset page when genre changes
  useEffect(() => {
    setPage(1);
  }, [selectedGenre]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        Popular TV Shows
      </h1>

      <Categories 
        selectedGenre={selectedGenre} 
        onSelectGenre={setSelectedGenre}
      />

      <MediaGrid 
        items={tvShowsData?.results || []} 
        type="tv" 
        hasMore={page < (tvShowsData?.total_pages || 1)}
        onLoadMore={() => setPage(page + 1)}
        isLoading={isFetching}
      />
    </div>
  );
}