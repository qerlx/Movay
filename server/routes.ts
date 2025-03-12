import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertMovieSchema, type TMDBResponse } from "@shared/schema";

const TMDB_API_KEY = "a343c567fae97cbedc48d5ad4b893f31";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_AUTH_HEADER = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzQzYzU2N2ZhZTk3Y2JlZGM0OGQ1YWQ0Yjg5M2YzMSIsIm5iZiI6MTc0MTc1NzA2NC43MzMsInN1YiI6IjY3ZDExYTg4MTM5OTBhMDU4YjYwYWExMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PfUfbFyxCtI3bJehMrDRUuuKOPp58WC-_4B4aUovCyA";

export async function registerRoutes(app: Express) {
  app.get("/api/movies/popular", async (req, res) => {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular`,
        {
          headers: {
            'Authorization': TMDB_AUTH_HEADER,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.statusText}`);
      }

      const data = await response.json() as TMDBResponse;

      // Store movies in our storage
      for (const movie of data.results) {
        const existing = await storage.getMovieByTMDBId(movie.id);
        if (!existing) {
          const movieData = insertMovieSchema.parse({
            tmdbId: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
            releaseDate: movie.release_date,
            voteAverage: Math.round(movie.vote_average),
            genres: movie.genre_ids,
          });
          await storage.createMovie(movieData);
        }
      }

      const movies = await storage.getPopularMovies();
      res.json(movies);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });

  app.get("/api/movies/stream/:tmdbId", async (req, res) => {
    try {
      const tmdbId = req.params.tmdbId;
      const response = await fetch(`https://moviesapi.club/movie/${tmdbId}`);

      if (!response.ok) {
        throw new Error('Failed to get stream URL');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching stream URL:", error);
      res.status(500).json({ message: "Failed to get stream URL" });
    }
  });

  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': TMDB_AUTH_HEADER,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.statusText}`);
      }

      const data = await response.json() as TMDBResponse;
      res.json(data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const movie = await storage.getMovie(id);

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}