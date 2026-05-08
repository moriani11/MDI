import { ObjectId } from "mongodb";

export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  playtime: number | null;
  metacritic: number | null;
  genres: Genre[];
  platforms: Platform[];
  parent_platforms: Platform[];
}

export interface GamesData {
  results: Game[];
}

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;
}