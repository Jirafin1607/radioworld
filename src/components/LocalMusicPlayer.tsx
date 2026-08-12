'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Upload,
  Trash2,
  ListMusic,
  Shuffle,
  Repeat,
  Repeat1,
  X,
  Disc3
} from 'lucide-react';
import { Song } from '@/lib/types';

interface LocalMusicPlayerProps {
  onAudioReady?: (audio: HTMLAudioElement) => void;
}

interface LocalTrack {
  id: string;
  file: File;
  name: string;
  url: string;
  duration?: number;
}

type RepeatMode = 'off' | 'all' | 'one';

export function LocalMusicPlayer({ onAudioReady }: LocalMusicPlayerProps) {
  const [tracks, setTracks] = useState<LocalTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isDragOver, setIsDragOver] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shuffledIndices = useRef<number[]>([]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.volume = volume;
      audioRef.current = audio;

      // Audio event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      if (onAudioReady) {
        onAudioReady(audio);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNext();
    }
  };

  const handleError = (e: Event) => {
    console.error('Audio error:', e);
    setIsPlaying(false);
  };

  const generateShuffledIndices = useCallback((length: number) => {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, []);

  const addFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/mp3', 'audio/x-m4a', 'audio/aac'];
      const validExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(file.type) || validExtensions.includes(ext);
    });

    const newTracks: LocalTrack[] = validFiles.map((file, index) => ({
      id: `local-${Date.now()}-${index}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
    }));

    setTracks(prev => [...prev, ...newTracks]);

    // Auto-play first track if no track is selected
    if (currentIndex === -1 && newTracks.length > 0) {
      playTrackAtIndex(tracks.length);
    }
  };

  const playTrackAtIndex = (index: number) => {
    if (index < 0 || index >= tracks.length) return;

    setCurrentIndex(index);
    
    if (audioRef.current && tracks[index]) {
      audioRef.current.src = tracks[index].url;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Playback error:', err));
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || currentIndex === -1) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Playback error:', err));
    }
  };

  const getActualIndex = (): number => {
    if (!isShuffle) return currentIndex;
    return shuffledIndices.current[currentIndex] ?? currentIndex;
  };

  const playNext = () => {
    if (tracks.length === 0) return;

    let nextIndex: number;
    
    if (isShuffle) {
      if (shuffledIndices.current.length !== tracks.length) {
        shuffledIndices.current = generateShuffledIndices(tracks.length);
        // Find current position in shuffled array
        const actualCurrent = getActualIndex();
        const posInShuffled = shuffledIndices.current.indexOf(actualCurrent);
        nextIndex = (posInShuffled + 1) % shuffledIndices.current.length;
      } else {
        nextIndex = (currentIndex + 1) % shuffledIndices.current.length;
      }
      nextIndex = shuffledIndices.current[nextIndex];
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }

    if (nextIndex === 0 && repeatMode === 'off' && currentIndex === tracks.length - 1) {
      setIsPlaying(false);
      return;
    }

    playTrackAtIndex(nextIndex);
  };

  const playPrevious = () => {
    if (tracks.length === 0) return;

    let prevIndex: number;
    
    if (isShuffle) {
      if (shuffledIndices.current.length !== tracks.length) {
        shuffledIndices.current = generateShuffledIndices(tracks.length);
      }
      const posInShuffled = currentIndex > 0 ? currentIndex - 1 : shuffledIndices.current.length - 1;
      prevIndex = shuffledIndices.current[posInShuffled];
    } else {
      prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    }

    playTrackAtIndex(prevIndex);
  };

  const removeTrack = (id: string) => {
    setTracks(prev => {
      const index = prev.findIndex(t => t.id === id);
      const newTracks = prev.filter(t => t.id !== id);
      
      // Clean up object URL
      URL.revokeObjectURL(prev[index]?.url || '');
      
      // Adjust current index if needed
      if (newTracks.length === 0) {
        setCurrentIndex(-1);
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
      } else if (index === currentIndex) {
        // Playing track was removed
        const newIndex = Math.min(index, newTracks.length - 1);
        playTrackAtIndex(newIndex);
      } else if (index < currentIndex) {
        setCurrentIndex(prev => prev - 1);
      }
      
      return newTracks;
    });
  };

  const clearAll = () => {
    tracks.forEach(track => URL.revokeObjectURL(track.url));
    setTracks([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIdx = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIdx + 1) % modes.length]);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Reset input so same files can be added again
      e.target.value = '';
    }
  };

  const currentTrack = tracks[currentIndex];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Upload Area */}
      <Card 
        className={`bg-gradient-to-br from-white/[0.12] to-white/[0.04] border-white/10 overflow-hidden transition-all duration-300 ${
          isDragOver ? 'border-purple-400 bg-purple-500/10 scale-[1.02]' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
              isDragOver ? 'bg-purple-500/30' : 'bg-white/5'
            }`}>
              <Upload className={`w-10 h-10 ${isDragOver ? 'text-purple-400' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragOver ? '¡Suelta tus archivos aquí!' : 'Sube tu música'}
            </h3>
            <p className="text-gray-400 mb-4">
              Arrastra archivos MP3, WAV, OGG, FLAC o M4A<br />
              o haz click para seleccionar
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Disc3 className="w-4 h-4" />
              Seleccionar Archivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".mp3,.wav,.ogg,.flac,.m4a,.aac,audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Track Player */}
      {currentTrack && (
        <Card className="bg-gradient-to-br from-white/[0.12] to-white/[0.04] border-white/10 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              {/* Album Art Placeholder */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                <Music className="w-8 h-8 text-white/50" />
              </div>
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{currentTrack.name}</h3>
                <p className="text-sm text-gray-400">Archivo local</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={seekTo}
                className="cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              {/* Shuffle */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsShuffle(!isShuffle);
                  if (!isShuffle) {
                    shuffledIndices.current = generateShuffledIndices(tracks.length);
                  }
                }}
                className={isShuffle ? 'text-purple-400' : 'text-gray-400'}
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              {/* Previous */}
              <Button
                size="sm"
                variant="ghost"
                onClick={playPrevious}
                className="text-gray-300 hover:text-white"
              >
                <SkipBack className="w-5 h-5" fill="currentColor" />
              </Button>

              {/* Play/Pause */}
              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </Button>

              {/* Next */}
              <Button
                size="sm"
                variant="ghost"
                onClick={playNext}
                className="text-gray-300 hover:text-white"
              >
                <SkipForward className="w-5 h-5" fill="currentColor" />
              </Button>

              {/* Repeat */}
              <Button
                size="sm"
                variant="ghost"
                onClick={cycleRepeatMode}
                className={repeatMode !== 'off' ? 'text-purple-400' : 'text-gray-400'}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 mt-4 justify-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={(value) => {
                  setVolume(value[0]);
                  if (isMuted) setIsMuted(false);
                }}
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playlist */}
      {tracks.length > 0 && (
        <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-purple-400" />
                Playlist ({tracks.length} canciones)
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearAll}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Limpiar todo
              </Button>
            </div>

            <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playTrackAtIndex(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Playing indicator or number */}
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {index === currentIndex && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-purple-400 animate-pulse rounded-full" style={{ height: '60%' }}></span>
                        <span className="w-1 bg-purple-400 animate-pulse rounded-full" style={{ height: '100%', animationDelay: '0.1s' }}></span>
                        <span className="w-1 bg-purple-400 animate-pulse rounded-full" style={{ height: '40%', animationDelay: '0.2s' }}></span>
                        <span className="w-1 bg-purple-400 animate-pulse rounded-full" style={{ height: '80%', animationDelay: '0.3s' }}></span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 group-hover:text-gray-300">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      index === currentIndex ? 'text-purple-300' : 'text-white'
                    }`}>
                      {track.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">Archivo local</p>
                  </div>

                  {/* Remove button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrack(track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {tracks.length === 0 && (
        <div className="text-center py-12">
          <Disc3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No hay canciones cargadas</p>
          <p className="text-sm text-gray-600 mt-1">Sube archivos de música para comenzar</p>
        </div>
      )}
    </div>
  );
}
