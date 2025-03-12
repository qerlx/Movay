import { type Movie } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaGrid } from "./MediaGrid";

interface PlayerProps {
  movie: Movie;
}

export function Player({ movie }: PlayerProps) {
  const [, setLocation] = useLocation();

  // Fetch related movies
  const { data: relatedMovies } = useQuery<Movie[]>({
    queryKey: [`/api/movies/popular`],
  });

  useEffect(() => {
    document.title = `Watch ${movie.title}`;
  }, [movie]);

  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <button
        onClick={() => setLocation(`/movie/${movie.id}`)}
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
                alt={movie.title}
                className="w-full rounded-lg shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-shadow duration-300"
              />
            </div>
          )}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              {movie.title}
            </h1>
            <p className="text-gray-400 leading-relaxed">{movie.overview}</p>
            {movie.releaseDate && (
              <p className="text-indigo-400 font-semibold">
                Released: {new Date(movie.releaseDate).getFullYear()}
              </p>
            )}
          </div>
        </div>

        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)]">
          <iframe
            src={`https://embed.su/embed/movie/${movie.tmdbId}`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        </div>

        {relatedMovies && relatedMovies.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              More Like This
            </h2>
            <MediaGrid items={relatedMovies.slice(0, 6)} type="movie" />
          </div>
        )}
      </div>
    </div>
  );
}