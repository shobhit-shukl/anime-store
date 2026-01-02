export interface Episode {
  number: number;
  title: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Movie {
  id?: string;
  title: string;
  seasons?: Season[];
  description?: string;
  duration?: string;
  releaseYear?: number;
  image?: string;
  rating?: number;
  status?: 'Ongoing' | 'Completed';
  genre?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  type?: string;
}