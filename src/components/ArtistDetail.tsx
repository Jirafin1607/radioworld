'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Play, 
  MapPin, 
  Calendar, 
  ExternalLink,
  ArrowLeft,
  Heart,
  Youtube,
  Globe,
  Headphones,
  BookOpen,
  Mic2
} from 'lucide-react';
import { Artist, Song } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ArtistDetailProps {
  artist: Artist;
  isFavorite?: boolean;
  onPlaySong: (song: Song, artist: Artist) => void;
  onToggleFavorite: (artist: Artist) => void;
  onBack?: () => void;
}

export function ArtistDetail({ 
  artist, 
  isFavorite = false,
  onPlaySong, 
  onToggleFavorite,
  onBack 
}: ArtistDetailProps) {
  // Check if artist has valid bio
  const hasValidBio = artist.bio && artist.bio.length > 20 && !artist.bio.includes('undefined');
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-gray-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a resultados
        </Button>
      )}

      {/* Header card with ALL info in one place */}
      <Card className="bg-gradient-to-br from-white/[0.12] to-white/[0.04] border-white/10 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Artist image */}
            <div className="relative w-full md:w-48 h-48 md:h-48 bg-gradient-to-br from-pink-600/30 to-purple-600/30 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
              {artist.image ? (
                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-20 h-20 text-white/20" />
              )}
              
              {/* Favorite button overlay */}
              <button
                onClick={() => onToggleFavorite(artist)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <Heart 
                  className={cn(
                    "w-5 h-5",
                    isFavorite ? "text-red-400 fill-red-400" : "text-white"
                  )} 
                />
              </button>
            </div>

            {/* Artist info - ALL IN ONE SECTION */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{artist.name}</h1>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-none">
                  {artist.genre}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {artist.origin}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {artist.yearsActive}
                </span>
              </div>

              {/* Biography preview - SHORT version here */}
              {hasValidBio && (
                <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                  {artist.bio}
                </p>
              )}

              {/* External links - ONLY HERE, not repeated */}
              <div className="flex flex-wrap gap-2 pt-2">
                {artist.links.spotify && (
                  <a
                    href={artist.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-full text-xs font-medium hover:bg-green-500/30 transition-colors"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    Spotify
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {artist.links.youtube && (
                  <a
                    href={artist.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-xs font-medium hover:bg-red-500/30 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    YouTube
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {artist.links.wikipedia && (
                  <a
                    href={artist.links.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Wikipedia
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {artist.links.appleMusic && (
                  <a
                    href={artist.links.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium hover:bg-pink-500/30 transition-colors"
                  >
                    <Music className="w-3.5 h-3.5" />
                    Apple Music
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Biography Section - ONLY if bio exists and is meaningful */}
      {hasValidBio && (
        <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              Biografía Completa
            </h2>
            <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4">
              {artist.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* Quick facts from bio */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Mic2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Género</p>
                  <p className="text-sm text-white">{artist.genre}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Carrera</p>
                  <p className="text-sm text-white">{artist.yearsActive}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Origen</p>
                  <p className="text-sm text-white">{artist.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Music className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Canciones Destacadas</p>
                  <p className="text-sm text-white">{artist.topSongs?.length || 0} temas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Songs */}
      <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-purple-400" fill="currentColor" />
            Mejores Canciones
          </h2>
          
          {artist.topSongs && artist.topSongs.length > 0 ? (
            <div className="space-y-2">
              {artist.topSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                  onClick={() => onPlaySong(song, artist)}
                >
                  {/* Song number */}
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 text-sm font-medium group-hover:bg-purple-500 group-hover:text-white transition-all">
                    {index + 1}
                  </span>

                  {/* Song info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                  </div>

                  {/* Duration */}
                  {song.duration && (
                    <span className="text-sm text-gray-500 hidden sm:block">
                      {song.duration}
                    </span>
                  )}

                  {/* Play button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 hover:text-purple-300"
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay canciones disponibles para este artista</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* No bio message */}
      {!hasValidBio && (
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-10 h-10 text-yellow-500/50 mx-auto mb-3" />
            <p className="text-yellow-200/80 text-sm">
              Biografía no disponible para este artista.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Pronto agregaremos más información.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
