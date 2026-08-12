'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Heart, Radio as RadioIcon, MapPin, Tag } from 'lucide-react';
import { RadioStation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RadioCardProps {
  station: RadioStation;
  isPlaying?: boolean;
  isFavorite?: boolean;
  onPlay: (station: RadioStation) => void;
  onToggleFavorite: (station: RadioStation) => void;
}

export function RadioCard({ 
  station, 
  isPlaying = false, 
  isFavorite = false,
  onPlay, 
  onToggleFavorite 
}: RadioCardProps) {
  // Get country flag emoji based on country code
  const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const tags = station.tags ? station.tags.split(',').slice(0, 3).filter(t => t.trim()) : [];

  return (
    <Card className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden">
      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] text-green-400 font-medium">EN VIVO</span>
        </div>
      )}

      {/* Station favicon/image area */}
      <div className="relative h-32 bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center overflow-hidden">
        {station.favicon ? (
          <img 
            src={station.favicon} 
            alt={station.name}
            className="w-16 h-16 object-contain rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <RadioIcon className="w-12 h-12 text-white/30 group-hover:text-purple-400 transition-colors" />
        )}
        
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Station name */}
        <h3 className="font-semibold text-white line-clamp-1 group-hover:text-purple-300 transition-colors" title={station.name}>
          {station.name}
        </h3>

        {/* Location and tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {station.countrycode && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-full">
              <span>{getFlagEmoji(station.countrycode)}</span>
              <span>{station.country}</span>
            </span>
          )}
          {station.state && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {station.state}
            </span>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span key={index} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-full">
                <Tag className="w-2.5 h-2.5" />
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => onPlay(station)}
            className={cn(
              "flex-1 gap-2 transition-all",
              isPlaying
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            )}
          >
            <Play className="w-4 h-4" fill={isPlaying ? "currentColor" : "none"} />
            {isPlaying ? 'Reproduciendo' : 'Escuchar'}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleFavorite(station)}
            className={cn(
              "px-3 transition-all",
              isFavorite && "text-red-400 hover:text-red-300"
            )}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>

        {/* Codec info */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 pt-1">
          <span>{station.codec || 'MP3'}</span>
          {station.bitrate && <span>{station.bitrate} kbps</span>}
        </div>
      </CardContent>
    </Card>
  );
}
