'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RadioStation } from '@/lib/types';
import { RadioCard } from './RadioCard';

interface RadioGridProps {
  stations: RadioStation[];
  isLoading?: boolean;
  currentStationId?: string | null;
  favorites: string[];
  onPlayStation: (station: RadioStation) => void;
  onToggleFavorite: (station: RadioStation) => void;
}

export function RadioGrid({ 
  stations, 
  isLoading = false,
  currentStationId = null,
  favorites = [],
  onPlayStation,
  onToggleFavorite
}: RadioGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (!stations || stations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📻</div>
        <h3 className="text-xl font-semibold text-white mb-2">No se encontraron estaciones</h3>
        <p className="text-gray-400">Intenta con otra búsqueda o filtro</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stations.map((station) => (
        <RadioCard
          key={station.stationuuid}
          station={station}
          isPlaying={currentStationId === station.stationuuid}
          isFavorite={favorites.includes(station.stationuuid)}
          onPlay={onPlayStation}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
