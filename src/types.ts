export type RoomId = 'home' | 'bedroom' | 'garden' | 'vanity' | 'bookshelf' | 'memory-box' | 'little-cafe' | 'guestbook' | 'games';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  source: 'synth' | 'piano' | 'pop';
  type: 'synth' | 'ambient' | 'song';
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  paperColor: string;
  waxSeal: string;
}

export interface FlowerNote {
  id: string;
  flowerType: 'lily' | 'rose' | 'daisy';
  message: string;
  position: { x: number; y: number };
  hasBloomed: boolean;
}

export interface PolaroidMemory {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  review: string;
  rating: number;
  genre: string;
}

export interface CafeItem {
  id: string;
  name: string;
  type: 'drink' | 'dessert';
  description: string;
  icon: string;
  interactions: string[];
}
