'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Artist } from '@/lib/types';
import { ArtistCard } from './ArtistCard';

interface ArtistGridProps {
  artists: Artist[];
  isLoading?: boolean;
  favorites: string[];
  onSelectArtist: (artist: Artist) => void;
  onToggleFavorite: (artist: Artist) => void;
}

export function ArtistGrid({ 
  artists, 
  isLoading = false,
  favorites = [],
  onSelectArtist,
  onToggleFavorite
}: ArtistGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎤</div>
        <h3 className="text-xl font-semibold text-white mb-2">No se encontraron artistas</h3>
        <p className="text-gray-400">Intenta con otra búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          isFavorite={favorites.includes(artist.id)}
          onSelect={onSelectArtist}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
