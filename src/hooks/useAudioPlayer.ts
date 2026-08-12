'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { RadioStation, Song, Artist, PlayerState } from '@/lib/types';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentStation: null,
    currentSong: null,
    currentArtist: null,
    volume: 0.8,
    progress: 0,
    duration: 0,
  });

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = playerState.volume;
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current && audioRef.current.duration) {
          setPlayerState(prev => ({
            ...prev,
            progress: (audioRef.current!.currentTime / audioRef.current!.duration) * 100,
            duration: audioRef.current!.duration,
          }));
        }
      });

      audioRef.current.addEventListener('ended', () => {
        setPlayerState(prev => ({
          ...prev,
          isPlaying: false,
          progress: 0,
        }));
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playStation = useCallback((station: RadioStation) => {
    if (!audioRef.current) return;

    audioRef.current.src = station.url_resolved || station.url;
    audioRef.current.play().catch(console.error);

    setPlayerState({
      isPlaying: true,
      currentStation: station,
      currentSong: null,
      currentArtist: null,
      volume: playerState.volume,
      progress: 0,
      duration: 0,
    });
  }, [playerState.volume]);

  const playSong = useCallback((song: Song, artist?: Artist) => {
    // For songs, we'll simulate playback since we don't have actual song URLs
    setPlayerState(prev => ({
      ...prev,
      isPlaying: true,
      currentSong: song,
      currentArtist: artist || prev.currentArtist,
      currentStation: null,
      progress: 0,
      duration: 180, // Simulated 3 minute duration
    }));

    // Simulate progress for demo
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setPlayerState(prev => ({
        ...prev,
        progress,
        isPlaying: progress < 100,
      }));
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1800); // Complete in ~3 minutes
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (playerState.isPlaying) {
      audioRef.current.pause();
    } else if (playerState.currentStation) {
      audioRef.current.play().catch(console.error);
    } else if (playerState.currentSong) {
      // Resume simulated playback would go here
    }

    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [playerState.isPlaying, playerState.currentStation, playerState.currentSong]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    setPlayerState({
      isPlaying: false,
      currentStation: null,
      currentSong: null,
      currentArtist: null,
      volume: playerState.volume,
      progress: 0,
      duration: 0,
    });
  }, [playerState.volume]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setPlayerState(prev => ({ ...prev, volume }));
  }, []);

  return {
    playerState,
    playStation,
    playSong,
    togglePlayPause,
    stopPlayback,
    setVolume,
  };
}
