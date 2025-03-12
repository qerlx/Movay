import { GENRE_MAP } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface CategoriesProps {
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
}

export function Categories({ selectedGenre, onSelectGenre }: CategoriesProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedGenre === null ? "default" : "outline"}
          onClick={() => onSelectGenre(null)}
          className="bg-[#1a1a2e] border-indigo-600/20 hover:bg-[#2a2a3e] transition-colors duration-300"
        >
          All
        </Button>
        {Object.entries(GENRE_MAP).map(([id, name]) => (
          <Button
            key={id}
            variant={selectedGenre === Number(id) ? "default" : "outline"}
            onClick={() => onSelectGenre(Number(id))}
            className="bg-[#1a1a2e] border-indigo-600/20 hover:bg-[#2a2a3e] transition-colors duration-300"
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
