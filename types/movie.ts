export interface Episode {
  number: number;
  title: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Anime {
  id?: string;
  title: string;
  image?: string;
  rating?: number;
  episodes: number;
  status?: 'Ongoing' | 'Completed';
  genre?: string[];
}

export const DUMMY_ANIME: Anime[] = [
  {
    id: '1',
    title: 'Jujutsu Kaisen',
    image: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=400',
    rating: 8.7,
    episodes: 24,
    status: 'Ongoing',
    genre: ['Action', 'Fantasy'],
  },
  {
    id: '2',
    title: 'Spy x Family',
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400',
    rating: 8.5,
    episodes: 12,
    status: 'Completed',
    genre: ['Comedy', 'Slice of Life'],
  },
  {
    id: '3',
    title: 'Chainsaw Man',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400',
    rating: 8.8,
    episodes: 12,
    status: 'Ongoing',
    genre: ['Action', 'Gore'],
  },
];