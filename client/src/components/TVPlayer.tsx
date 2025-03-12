import { type TVShow } from "@shared/schema";
import { ArrowLeft, Heart, Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { useQuery } from "@tanstack/react-query";

interface TVPlayerProps {
  show: TVShow;
}

export function TVPlayer({ show }: TVPlayerProps) {
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const { data: seasonData } = useQuery({
    queryKey: [`/api/tv/${show.tmdbId}/season/${selectedSeason}`],
    enabled: !!show.tmdbId && selectedSeason > 0,
  });

  useEffect(() => {
    document.title = `Watch ${show.title}`;

    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setIsHudVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsHudVisible(false), 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [show]);

  const posterUrl = show.posterPath 
    ? `https://image.tmdb.org/t/p/w500${show.posterPath}`
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Navigation */}
      <button
        onClick={() => setLocation(`/tv/${show.id}`)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-full bg-[#1a1a2e]/50 hover:bg-indigo-600 transition-all duration-300 transform hover:scale-110 ${
          !isHudVisible && 'opacity-0'
        }`}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="container mx-auto px-4 py-8">
        {/* Show Info */}
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

            {/* Season/Episode Selection */}
            <div className="flex gap-4 mt-4">
              <Select
                value={selectedSeason.toString()}
                onValueChange={(value) => setSelectedSeason(parseInt(value))}
                className="w-40 bg-[#1a1a2e] border-indigo-600/30"
              >
                {Array.from({ length: show.numberOfSeasons || 0 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Season {i + 1}
                  </option>
                ))}
              </Select>

              <Select
                value={selectedEpisode.toString()}
                onValueChange={(value) => setSelectedEpisode(parseInt(value))}
                className="w-40 bg-[#1a1a2e] border-indigo-600/30"
              >
                {Array.from({ length: seasonData?.episodes?.length || 0 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Episode {i + 1}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Player Container */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)]">
          <iframe
            src={`https://embed.su/embed/tv/${show.tmdbId}/${selectedSeason}/${selectedEpisode}`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
          />

          {/* Bottom HUD */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/90 to-transparent transition-opacity duration-300 ${
              !isHudVisible && 'opacity-0'
            }`}
          >
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-indigo-600/30 transition-colors duration-300"
              >
                {isMuted ? (
                  <VolumeX className="transform hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Volume2 className="transform hover:scale-110 transition-transform duration-300" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`${
                  isLiked ? 'text-indigo-400' : 'text-white'
                } hover:bg-indigo-600/30 transition-all duration-300`}
              >
                <Heart 
                  className={`transform hover:scale-110 transition-transform duration-300 ${
                    isLiked ? 'fill-current animate-like' : ''
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
