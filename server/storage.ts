import { movies, type Movie, type InsertMovie } from "@shared/schema";

export interface IStorage {
  getMovie(id: number): Promise<Movie | undefined>;
  getMovieByTMDBId(tmdbId: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  searchMovies(query: string): Promise<Movie[]>;
  getPopularMovies(): Promise<Movie[]>;
}

export class MemStorage implements IStorage {
  private movies: Map<number, Movie>;
  currentId: number;

  constructor() {
    this.movies = new Map();
    this.currentId = 1;
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMovieByTMDBId(tmdbId: number): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(
      (movie) => movie.tmdbId === tmdbId
    );
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.currentId++;
    const movie: Movie = { ...insertMovie, id };
    this.movies.set(id, movie);
    return movie;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.movies.values()).filter(movie =>
      movie.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getPopularMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }
}

export const storage = new MemStorage();
