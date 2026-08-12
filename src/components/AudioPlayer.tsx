'use client';

import { PlayerState, RadioStation, Song, Artist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X,
  Radio as RadioIcon,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  playerState: PlayerState;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  localAudioElement?: HTMLAudioElement | null;
}

export function AudioPlayer({ 
  playerState, 
  onTogglePlayPause, 
  onStop,
  onVolumeChange,
  localAudioElement 
}: AudioPlayerProps) {
  const { isPlaying, currentStation, currentSong, currentArtist, volume, progress } = playerState;

  // Don't render if nothing is playing or selected (but allow local audio)
  const hasLocalAudio = localAudioElement && (localAudioElement.src || !localAudioElement.paused);
  if (!currentStation && !currentSong && !hasLocalAudio) return null;

  // For local audio, we need to determine if it's playing
  const isLocalPlaying = hasLocalAudio && !localAudioElement?.paused;
  
  const title = currentStation?.name || currentSong?.title || 'Reproduciendo archivo local';
  const subtitle = currentStation 
    ? `${currentStation.country}${currentStation.state ? ` • ${currentStation.state}` : ''} • ${currentStation.tags?.split(',')[0] || 'Radio'}`
    : currentArtist?.name || 'Archivo local';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-black/90 border-t border-white/10 backdrop-blur-xl">
      {/* Progress bar for songs */}
      {currentSong && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Now playing info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              currentStation ? "bg-gradient-to-br from-purple-600 to-pink-600" : "bg-gradient-to-br from-pink-600 to-purple-600"
            )}>
              {currentStation ? (
                <RadioIcon className={cn("w-6 h-6 text-white", isPlaying && "animate-pulse")} />
              ) : (
                <Music className="w-6 h-6 text-white" />
              )}
            </div>

            {/* Text info */}
            <div className="min-w-0">
              <p className="font-medium text-white truncate text-sm md:text-base">
                {title}
              </p>
              <p className="text-xs md:text-sm text-gray-400 truncate">
                {subtitle}
              </p>
            </div>

            {/* Live indicator for radio */}
            {(isPlaying || isLocalPlaying) && currentStation && (
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] text-red-400 font-medium">EN VIVO</span>
              </span>
            )}
            
            {/* Local audio indicator */}
            {isLocalPlaying && !currentStation && !currentSong && (
              <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/20 rounded-full">
                <Music className="w-3 h-3 text-purple-400 animate-pulse" />
                <span className="text-[10px] text-purple-400 font-medium">LOCAL</span>
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (hasLocalAudio && !currentStation && !currentSong) {
                  // Toggle local audio
                  if (localAudioElement?.paused) {
                    localAudioElement.play();
                  } else {
                    localAudioElement?.pause();
                  }
                } else {
                  onTogglePlayPause();
                }
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              {(isPlaying || isLocalPlaying) ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onStop}
              className="w-8 h-8 rounded-full text-gray-400 hover:text-white hover:bg-white/10 hidden sm:flex"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume control */}
          <div className="hidden md:flex items-center gap-2 w-32">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
              className="w-8 h-8 text-gray-400 hover:text-white p-0"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Add padding at bottom for mobile safe area */}
      <div className="h-safe-area-inset-bottom bg-black" />
    </div>
  );
}
