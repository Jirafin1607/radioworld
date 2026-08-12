// Radio Station Types
export interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  clickcount: number;
  clicktrend: number;
}

export interface RadioSearchResult {
  result: RadioStation[];
  total: number;
  offset: number;
}

export interface CountryInfo {
  name: string;
  code: string;
  stationCount: number;
  flag: string;
}

export interface TagInfo {
  name: string;
  stationCount: number;
}

// Artist Types
export interface Artist {
  id: string;
  name: string;
  genre: string;
  origin: string;
  yearsActive: string;
  bio: string;
  image: string;
  topSongs: Song[];
  links: ArtistLinks;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  playCount?: number;
}

export interface ArtistLinks {
  spotify?: string;
  youtube?: string;
  wikipedia?: string;
  appleMusic?: string;
}

export interface ArtistSearchResult {
  artists: Artist[];
  total: number;
}

// Player Types
export interface PlayerState {
  isPlaying: boolean;
  currentStation: RadioStation | null;
  currentSong: Song | null;
  currentArtist: Artist | null;
  volume: number;
  progress: number;
  duration: number;
}

// Favorite Types
export interface FavoriteItem {
  id: string;
  type: 'station' | 'artist';
  addedAt: string;
  data: RadioStation | Artist;
}
