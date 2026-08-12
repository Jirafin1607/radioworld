'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, MapPin, Calendar, Heart } from 'lucide-react';
import { Artist } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  artist: Artist;
  isFavorite?: boolean;
  onSelect: (artist: Artist) => void;
  onToggleFavorite: (artist: Artist) => void;
}

export function ArtistCard({ artist, isFavorite = false, onSelect, onToggleFavorite }: ArtistCardProps) {
  return (
    <Card 
      className="group bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer"
      onClick={() => onSelect(artist)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Artist image/icon */}
        <div className="relative w-full h-40 bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl flex items-center justify-center overflow-hidden">
          {artist.image ? (
            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
          ) : (
            <Music className="w-16 h-16 text-white/20 group-hover:text-pink-400 transition-colors" />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Artist info */}
        <div>
          <h3 className="font-semibold text-white text-lg group-hover:text-pink-300 transition-colors line-clamp-1">
            {artist.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">{artist.genre}</p>
        </div>

        {/* Meta info */}
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {artist.origin}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {artist.yearsActive}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 border-white/20 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(artist);
            }}
          >
            Ver más
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(artist);
            }}
            className={cn(
              "px-3 transition-all",
              isFavorite && "text-red-400 hover:text-red-300"
            )}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
