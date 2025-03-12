import { type TVShow } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface TVPlayerProps {
  show: TVShow;
}

export function TVPlayer({ show }: TVPlayerProps) {
  const [, setLocation] = useLocation();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const { data: seasonData } = useQuery({
    queryKey: [`/api/tv/${show.tmdbId}/season/${selectedSeason}`],
    enabled: !!show.tmdbId && selectedSeason > 0,
  });

  useEffect(() => {
    document.title = `Watch ${show.title}`;
  }, [show]);

  const posterUrl = show.posterPath 
    ? `https://image.tmdb.org/t/p/w500${show.posterPath}`
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <button
        onClick={() => setLocation(`/tv/${show.id}`)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-[#1a1a2e]/50 hover:bg-indigo-600 transition-all duration-300 transform hover:scale-110"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 animate-fade-in">
          {posterUrl && (
            <div className="hidden md:block transform hover:scale-105 transition-transform duration-300">
              <img
                src={posterUrl}
                alt={show.title}
                className="w-full rounded-lg shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-shadow duration-300"
              />
            </div>
          )}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              {show.title}
            </h1>
            <p className="text-gray-400 leading-relaxed">{show.overview}</p>
            {show.firstAirDate && (
              <p className="text-indigo-400 font-semibold">
                First Aired: {new Date(show.firstAirDate).getFullYear()}
              </p>
            )}

            <div className="flex gap-4 mt-4">
              <Select
                value={selectedSeason.toString()}
                onValueChange={(value) => setSelectedSeason(parseInt(value))}
              >
                <SelectTrigger className="w-40 bg-[#1a1a2e] border-indigo-600/30">
                  <SelectValue placeholder="Select Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: show.numberOfSeasons || 0 }).map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Season {i + 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={selectedEpisode.toString()}
                onValueChange={(value) => setSelectedEpisode(parseInt(value))}
              >
                <SelectTrigger className="w-40 bg-[#1a1a2e] border-indigo-600/30">
                  <SelectValue placeholder="Select Episode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: seasonData?.episodes?.length || 0 }).map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Episode {i + 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)]">
          <iframe
            src={`https://embed.su/embed/tv/${show.tmdbId}/${selectedSeason}/${selectedEpisode}`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        </div>
      </div>
    </div>
  );
}