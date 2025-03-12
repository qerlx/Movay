import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
} as const;

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  releaseDate: text("release_date"),
  voteAverage: integer("vote_average"),
  genres: jsonb("genres").$type<string[]>().default([]),
});

export const tvShows = pgTable("tv_shows", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  firstAirDate: text("first_air_date"),
  voteAverage: integer("vote_average"),
  genres: jsonb("genres").$type<string[]>().default([]),
  numberOfSeasons: integer("number_of_seasons"),
});

export const insertMovieSchema = createInsertSchema(movies).omit({ id: true });
export const insertTVShowSchema = createInsertSchema(tvShows).omit({ id: true });

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type InsertTVShow = z.infer<typeof insertTVShowSchema>;
export type Movie = typeof movies.$inferSelect;
export type TVShow = typeof tvShows.$inferSelect;

// TMDB API Types
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  number_of_seasons: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[] | TMDBTVShow[];
  total_pages: number;
  total_results: number;
}

export interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  episode_count: number;
  air_date: string;
}

export interface TMDBEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
}