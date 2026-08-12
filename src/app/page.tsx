'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { SmartArtistSearch } from '@/components/SmartArtistSearch';
import { RadioGrid } from '@/components/RadioGrid';
import { RadioFilters } from '@/components/RadioFilters';
import { ArtistGrid } from '@/components/ArtistGrid';
import { ArtistDetail } from '@/components/ArtistDetail';
import { AudioPlayer } from '@/components/AudioPlayer';
import { FavoritesList } from '@/components/FavoritesList';
import { LocalMusicPlayer } from '@/components/LocalMusicPlayer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFavorites } from '@/hooks/useFavorites';
import { RadioStation, Artist, Song } from '@/lib/types';

type TabType = 'radio' | 'artists' | 'local' | 'favorites';
type ViewMode = 'grid' | 'detail';

export default function Home() {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('radio');
  
  // Radio state
  const [radioSearch, setRadioSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  
  // Artist state
  const [artistSearch, setArtistSearch] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  
  // View state
  const [artistViewMode, setArtistViewMode] = useState<ViewMode>('grid');
  
  // Local audio element for equalizer
  const [localAudioElement, setLocalAudioElement] = useState<HTMLAudioElement | null>(null);

  // Hooks
  const {
    playerState,
    playStation,
    playSong,
    togglePlayPause,
    stopPlayback,
    setVolume,
  } = useAudioPlayer();

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  } = useFavorites();

  // Fetch radio stations
  const fetchStations = useCallback(async () => {
    setIsLoadingStations(true);
    try {
      // Try localStorage first for user-added stations
      let savedStations: RadioStation[] = [];
      try {
        const saved = localStorage.getItem('radioworld-stations');
        if (saved) {
          savedStations = JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error reading saved stations:', e);
      }

      const params = new URLSearchParams();
      if (radioSearch) params.append('query', radioSearch);
      if (selectedCountry) params.append('country', selectedCountry);
      if (selectedGenre) params.append('tag', selectedGenre);
      params.append('limit', '50');

      const response = await fetch(`/api/radio/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.result) {
        // Merge saved stations with API results, prioritizing saved ones
        const apiStations = data.result as RadioStation[];
        const mergedStations = [...savedStations];
        
        apiStations.forEach(apiStation => {
          const exists = mergedStations.some(s => s.stationuuid === apiStation.stationuuid);
          if (!exists) {
            mergedStations.push(apiStation);
          }
        });
        
        setStations(mergedStations);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setIsLoadingStations(false);
    }
  }, [radioSearch, selectedCountry, selectedGenre]);

  // Fetch artists
  const fetchArtists = useCallback(async () => {
    setIsLoadingArtists(true);
    try {
      const params = new URLSearchParams();
      if (artistSearch) params.append('query', artistSearch);

      const response = await fetch(`/api/artist/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.artists) {
        setArtists(data.artists);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setIsLoadingArtists(false);
    }
  }, [artistSearch]);

  // Initial load and search effects
  useEffect(() => {
    if (activeTab === 'radio') {
      fetchStations();
    }
  }, [activeTab, fetchStations]);

  useEffect(() => {
    if (activeTab === 'artists') {
      fetchArtists();
    }
  }, [activeTab, fetchArtists]);

  // Debounced search for radio
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'radio') {
        fetchStations();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [radioSearch, activeTab, fetchStations]);

  // Debounced search for artists
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'artists') {
        fetchArtists();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [artistSearch, activeTab, fetchArtists]);

  // Handlers
  const handlePlayStation = (station: RadioStation) => {
    playStation(station);
  };

  const handlePlaySong = (song: Song, artist?: Artist) => {
    playSong(song, artist);
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setArtistViewMode('detail');
  };

  const handleBackToArtists = () => {
    setSelectedArtist(null);
    setArtistViewMode('grid');
  };

  const handleToggleFavorite = (item: RadioStation | Artist, type: 'station' | 'artist') => {
    toggleFavorite(item, type);
  };

  const handleClearFilters = () => {
    setSelectedCountry('');
    setSelectedGenre('');
    setRadioSearch('');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    stopPlayback(); // Optional: stop playback when switching tabs
  };

  const handleLocalAudioReady = (audio: HTMLAudioElement) => {
    setLocalAudioElement(audio);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-32">
        {/* RADIO TAB */}
        {activeTab === 'radio' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Search */}
            <SearchBar
              value={radioSearch}
              onChange={setRadioSearch}
              placeholder="Buscar estaciones de radio... (ej: Stereo Rey, 80s, Universal)"
            />

            {/* Filters */}
            <RadioFilters
              selectedCountry={selectedCountry}
              selectedGenre={selectedGenre}
              onCountryChange={setSelectedCountry}
              onGenreChange={setSelectedGenre}
              onClearFilters={handleClearFilters}
            />

            {/* Results count */}
            {!isLoadingStations && stations.length > 0 && (
              <p className="text-sm text-gray-400">
                Se encontraron <span className="text-white font-medium">{stations.length}</span> estaciones
              </p>
            )}

            {/* Station grid */}
            <RadioGrid
              stations={stations}
              isLoading={isLoadingStations}
              currentStationId={playerState.currentStation?.stationuuid || null}
              favorites={favorites.filter(f => f.type === 'station').map(f => f.id)}
              onPlayStation={handlePlayStation}
              onToggleFavorite={(station) => handleToggleFavorite(station, 'station')}
            />
          </div>
        )}

        {/* ARTISTS TAB */}
        {activeTab === 'artists' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            {artistViewMode === 'grid' ? (
              <>
                {/* Smart AI-Powered Artist Search with Autocomplete */}
                <SmartArtistSearch
                  value={artistSearch}
                  onChange={setArtistSearch}
                  placeholder="Buscar artista con IA... (ej: 'Ángeles', 'Michael', 'Bad Bunny')"
                />

                {/* Results count */}
                {!isLoadingArtists && artists.length > 0 && (
                  <p className="text-sm text-gray-400">
                    Se encontraron <span className="text-white font-medium">{artists.length}</span> artistas
                  </p>
                )}

                {/* Artist grid */}
                <ArtistGrid
                  artists={artists}
                  isLoading={isLoadingArtists}
                  favorites={favorites.filter(f => f.type === 'artist').map(f => f.id)}
                  onSelectArtist={handleSelectArtist}
                  onToggleFavorite={(artist) => handleToggleFavorite(artist, 'artist')}
                />
              </>
            ) : selectedArtist ? (
              <ArtistDetail
                artist={selectedArtist}
                isFavorite={isFavorite(selectedArtist.id)}
                onPlaySong={handlePlaySong}
                onToggleFavorite={(artist) => handleToggleFavorite(artist, 'artist')}
                onBack={handleBackToArtists}
              />
            ) : null}
          </div>
        )}

        {/* LOCAL MUSIC TAB */}
        {activeTab === 'local' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <LocalMusicPlayer onAudioReady={handleLocalAudioReady} />
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <FavoritesList
              favorites={favorites}
              onRemoveFavorite={removeFavorite}
              onClearAll={clearFavorites}
            />
          </div>
        )}
      </main>

      {/* Sticky Audio Player */}
      <AudioPlayer
        playerState={playerState}
        onTogglePlayPause={togglePlayPause}
        onStop={stopPlayback}
        onVolumeChange={setVolume}
        localAudioElement={localAudioElement}
      />
    </div>
  );
}
