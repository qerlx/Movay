import { movies, tvShows, type Movie, type TVShow, type InsertMovie, type InsertTVShow } from "@shared/schema";

export interface IStorage {
  // Movie methods
  getMovie(id: number): Promise<Movie | undefined>;
  getMovieByTMDBId(tmdbId: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  searchMovies(query: string): Promise<Movie[]>;
  getPopularMovies(): Promise<Movie[]>;

  // TV Show methods
  getTVShow(id: number): Promise<TVShow | undefined>;
  getTVShowByTMDBId(tmdbId: number): Promise<TVShow | undefined>;
  createTVShow(tvShow: InsertTVShow): Promise<TVShow>;
  searchTVShows(query: string): Promise<TVShow[]>;
  getPopularTVShows(): Promise<TVShow[]>;
}

export class MemStorage implements IStorage {
  private movies: Map<number, Movie>;
  private tvShows: Map<number, TVShow>;
  private movieCurrentId: number;
  private tvShowCurrentId: number;

  constructor() {
    this.movies = new Map();
    this.tvShows = new Map();
    this.movieCurrentId = 1;
    this.tvShowCurrentId = 1;
  }

  // Movie methods
  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMovieByTMDBId(tmdbId: number): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(
      (movie) => movie.tmdbId === tmdbId
    );
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.movieCurrentId++;
    const movie = { id, ...insertMovie };
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

  // TV Show methods
  async getTVShow(id: number): Promise<TVShow | undefined> {
    return this.tvShows.get(id);
  }

  async getTVShowByTMDBId(tmdbId: number): Promise<TVShow | undefined> {
    return Array.from(this.tvShows.values()).find(
      (tvShow) => tvShow.tmdbId === tmdbId
    );
  }

  async createTVShow(insertTVShow: InsertTVShow): Promise<TVShow> {
    const id = this.tvShowCurrentId++;
    const tvShow = { id, ...insertTVShow };
    this.tvShows.set(id, tvShow);
    return tvShow;
  }

  async searchTVShows(query: string): Promise<TVShow[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tvShows.values()).filter(tvShow =>
      tvShow.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getPopularTVShows(): Promise<TVShow[]> {
    return Array.from(this.tvShows.values());
  }
}

export const storage = new MemStorage();