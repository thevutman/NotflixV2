export type TitleType = "MOVIE" | "SERIES";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  order: number;
}

interface TitleBase {
  id: string;
  slug: string;
  name: string;
  originalName?: string;
  description: string;
  classification: string;
  category: string;
  year: number;
  cast: string[];
  country?: string;
  poster: string;
  backdrop: string;
  source?: string;
  views: number;
  featured?: boolean;
}

export interface Movie extends TitleBase {
  type: "MOVIE";
  director: string;
  duration: number;
  video: string;
}

export interface Episode {
  number: number;
  name: string;
  year: number;
  duration: number;
  video: string;
}

export interface Series extends TitleBase {
  type: "SERIES";
  creator: string;
  season: number;
  episodes: Episode[];
}

export type Title = Movie | Series;

export interface Home {
  featured: Title[];
  categories: Category[];
  movies: Movie[];
  series: Series[];
}

export interface Session {
  id: string;
  token: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Client {
  id: string;
  email: string;
  name: string;
  lastName: string;
  birthDate?: string;
  phone?: string;
}
