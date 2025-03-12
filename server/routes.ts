import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertMovieSchema, insertTVShowSchema, type TMDBResponse, type TMDBMovie, type TMDBTVShow } from "@shared/schema";

const TMDB_API_KEY = "a343c567fae97cbedc48d5ad4b893f31";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_AUTH_HEADER = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzQzYzU2N2ZhZTk3Y2JlZGM0OGQ1YWQ0Yjg5M2YzMSIsIm5iZiI6MTc0MTc1NzA2NC43MzMsInN1YiI6IjY3ZDExYTg4MTM5OTBhMDU4YjYwYWExMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PfUfbFyxCtI3bJehMrDRUuuKOPp58WC-_4B4aUovCyA";

function isTMDBMovie(item: TMDBMovie | TMDBTVShow): item is TMDBMovie {
  return 'title' in item && !('name' in item);
}

export async function registerRoutes(app: Express) {
  // Movie routes
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
      const movies = data.results.filter(isTMDBMovie);

      // Store movies in our storage
      for (const movie of movies) {
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

      // Get all movies from storage
      const storedMovies = await storage.getPopularMovies();
      res.json(storedMovies);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // First try to get from storage
      const movie = await storage.getMovie(id);

      if (!movie) {
        // If not in storage, fetch from TMDB
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${id}`,
          {
            headers: {
              'Authorization': TMDB_AUTH_HEADER,
              'accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          return res.status(404).json({ message: "Movie not found" });
        }

        const tmdbMovie = await response.json();
        const movieData = insertMovieSchema.parse({
          tmdbId: tmdbMovie.id,
          title: tmdbMovie.title,
          overview: tmdbMovie.overview,
          posterPath: tmdbMovie.poster_path,
          backdropPath: tmdbMovie.backdrop_path,
          releaseDate: tmdbMovie.release_date,
          voteAverage: Math.round(tmdbMovie.vote_average),
          genres: tmdbMovie.genre_ids || [],
        });

        // Store in our database
        const newMovie = await storage.createMovie(movieData);
        return res.json(newMovie);
      }

      res.json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  // TV Show routes
  app.get("/api/tv/popular", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const genre = req.query.genre ? parseInt(req.query.genre as string) : null;

      let url = `${TMDB_BASE_URL}/tv/popular?page=${page}`;
      if (genre) {
        url += `&with_genres=${genre}`;
      }

      const response = await fetch(
        url,
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
      const tvShows = data.results
        .filter((item): item is TMDBTVShow => !isTMDBMovie(item))
        .map(show => ({
          id: show.id,
          tmdbId: show.id,
          title: show.name,
          overview: show.overview,
          posterPath: show.poster_path,
          backdropPath: show.backdrop_path,
          firstAirDate: show.first_air_date,
          voteAverage: Math.round(show.vote_average),
          genres: show.genre_ids,
          numberOfSeasons: show.number_of_seasons || 1,
        }));

      // Store TV shows in our storage
      for (const show of tvShows) {
        const existing = await storage.getTVShowByTMDBId(show.tmdbId);
        if (!existing) {
          const showData = insertTVShowSchema.parse(show);
          await storage.createTVShow(showData);
        }
      }

      res.json({
        results: tvShows,
        page,
        total_pages: data.total_pages,
        total_results: data.total_results
      });
    } catch (error) {
      console.error("Error fetching popular TV shows:", error);
      res.status(500).json({ message: "Failed to fetch popular TV shows" });
    }
  });

  app.get("/api/tv/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // First try to get from storage
      const tvShow = await storage.getTVShow(id);

      if (!tvShow) {
        // If not in storage, fetch from TMDB
        const response = await fetch(
          `${TMDB_BASE_URL}/tv/${id}`,
          {
            headers: {
              'Authorization': TMDB_AUTH_HEADER,
              'accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          return res.status(404).json({ message: "TV show not found" });
        }

        const tmdbShow = await response.json();
        const showData = insertTVShowSchema.parse({
          tmdbId: tmdbShow.id,
          title: tmdbShow.name,
          overview: tmdbShow.overview,
          posterPath: tmdbShow.poster_path,
          backdropPath: tmdbShow.backdrop_path,
          firstAirDate: tmdbShow.first_air_date,
          voteAverage: Math.round(tmdbShow.vote_average),
          genres: tmdbShow.genre_ids || [],
          numberOfSeasons: tmdbShow.number_of_seasons || 1,
        });

        // Store in our database
        const newShow = await storage.createTVShow(showData);
        return res.json(newShow);
      }

      res.json(tvShow);
    } catch (error) {
      console.error("Error fetching TV show:", error);
      res.status(500).json({ message: "Failed to fetch TV show" });
    }
  });

  app.get("/api/tv/:id/season/:seasonNumber", async (req, res) => {
    try {
      const { id, seasonNumber } = req.params;
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${id}/season/${seasonNumber}`,
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

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching season details:", error);
      res.status(500).json({ message: "Failed to fetch season details" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}`,
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

      // Process movies and TV shows from the results
      const movies = data.results
        .filter(isTMDBMovie)
        .map(movie => ({
          id: movie.id,
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          releaseDate: movie.release_date,
          voteAverage: Math.round(movie.vote_average),
          genres: movie.genre_ids,
        }));

      const tvShows = data.results
        .filter((item): item is TMDBTVShow => !isTMDBMovie(item) && item.media_type === "tv")
        .map(show => ({
          id: show.id,
          tmdbId: show.id,
          title: show.name,
          overview: show.overview,
          posterPath: show.poster_path,
          backdropPath: show.backdrop_path,
          firstAirDate: show.first_air_date,
          voteAverage: Math.round(show.vote_average),
          genres: show.genre_ids,
          numberOfSeasons: show.number_of_seasons,
        }));

      // Store the results in our storage
      for (const movie of movies) {
        const existing = await storage.getMovieByTMDBId(movie.tmdbId);
        if (!existing) {
          const movieData = insertMovieSchema.parse(movie);
          await storage.createMovie(movieData);
        }
      }

      for (const show of tvShows) {
        const existing = await storage.getTVShowByTMDBId(show.tmdbId);
        if (!existing) {
          const showData = insertTVShowSchema.parse(show);
          await storage.createTVShow(showData);
        }
      }

      res.json({
        movies,
        tvShows,
        total_results: data.total_results,
        page: data.page,
        total_pages: data.total_pages
      });
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ message: "Failed to search" });
    }
  });

  app.get("/api/movies/watch/:tmdbId", async (req, res) => {
    try {
      const tmdbId = req.params.tmdbId;
      
      // Set appropriate content type
      res.setHeader('Content-Type', 'text/html');
      
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Movie Player</title>
            <style>
              body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }
              .player-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
              .player-fallback { color: white; text-align: center; }
            </style>
          </head>
          <body>
            <div class="player-container">
              <div class="player-fallback">
                <h2>Movie ID: ${tmdbId}</h2>
                <p>This is a demo player. In a real application, this would play the actual movie.</p>
              </div>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error serving watch page:", error);
      res.status(500).send("Failed to load movie player");
    }
  });
  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}`,
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

      // Separate movies and TV shows
      const movies = data.results
        .filter(isTMDBMovie)
        .map(movie => ({
          id: movie.id,
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          releaseDate: movie.release_date,
          voteAverage: Math.round(movie.vote_average),
          genres: movie.genre_ids,
        }));

      const tvShows = data.results
        .filter((item): item is TMDBTVShow => !isTMDBMovie(item))
        .map(show => ({
          id: show.id,
          tmdbId: show.id,
          title: show.name,
          overview: show.overview,
          posterPath: show.poster_path,
          backdropPath: show.backdrop_path,
          firstAirDate: show.first_air_date,
          voteAverage: Math.round(show.vote_average),
          genres: show.genre_ids,
          numberOfSeasons: show.number_of_seasons,
        }));

      res.json({ movies, tvShows });
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ message: "Failed to search" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}