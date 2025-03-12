import { type Movie } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const [, setLocation] = useLocation();
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.posterPath}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
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
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent p-4 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-sm line-clamp-1">{movie.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{movie.releaseDate?.split("-")[0]}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}