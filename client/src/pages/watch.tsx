
import { useEffect } from "react";
import { useRoute } from "wouter";

export default function WatchPage() {
  const [, params] = useRoute("/watch/:id");
  const movieId = params?.id;

  useEffect(() => {
    // Load movie in iframe instead of trying to initialize player directly
    document.title = "Watching Movie";
  }, [movieId]);

  if (!movieId) {
    return <div className="container py-8">Movie ID not found</div>;
  }

  return (
    <div className="w-full h-screen bg-black pt-0 mt-0">
      <iframe
        src={`/api/movies/watch/${movieId}`}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
