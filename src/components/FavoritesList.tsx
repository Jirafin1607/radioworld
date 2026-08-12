'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio as RadioIcon, Music, Trash2, ExternalLink } from 'lucide-react';
import { FavoriteItem, RadioStation, Artist } from '@/lib/types';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface FavoritesListProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export function FavoritesList({ favorites, onRemoveFavorite, onClearAll }: FavoritesListProps) {
  const { playStation, playSong } = useAudioPlayer();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">💜</div>
        <h3 className="text-xl font-semibold text-white mb-2">No tienes favoritos aún</h3>
        <p className="text-gray-400">Explora estaciones y artistas para agregarlos aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Mis Favoritos ({favorites.length})
        </h2>
        {favorites.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar todo
          </Button>
        )}
      </div>

      {/* Stations favorites */}
      {favorites.filter(f => f.type === 'station').length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-purple-300 flex items-center gap-2">
            <RadioIcon className="w-5 h-5" />
            Estaciones de Radio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favorites
              .filter(f => f.type === 'station')
              .map((favorite) => {
                const station = favorite.data as RadioStation;
                return (
                  <Card
                    key={favorite.id}
                    className="bg-gradient-to-r from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40 transition-all group"
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <RadioIcon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{station.name}</h4>
                        <p className="text-sm text-gray-400">{station.country}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playStation(station)}
                          className="text-green-400 hover:bg-green-500/10"
                        >
                          ▶️
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveFavorite(favorite.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Artists favorites */}
      {favorites.filter(f => f.type === 'artist').length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-pink-300 flex items-center gap-2">
            <Music className="w-5 h-5" />
            Artistas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favorites
              .filter(f => f.type === 'artist')
              .map((favorite) => {
                const artist = favorite.data as Artist;
                return (
                  <Card
                    key={favorite.id}
                    className="bg-gradient-to-r from-pink-500/10 to-transparent border-pink-500/20 hover:border-pink-500/40 transition-all group"
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6 text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{artist.name}</h4>
                        <p className="text-sm text-gray-400 line-clamp-1">{artist.genre}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {artist.links.spotify && (
                          <a
                            href={artist.links.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveFavorite(favorite.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
