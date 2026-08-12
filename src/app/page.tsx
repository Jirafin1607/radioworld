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
import { StationForm } from '@/components/StationForm';
import { Equalizer } from '@/components/Equalizer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFavorites } from '@/hooks/useFavorites';
import { RadioStation, Artist, Song } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trash2, Info, Radio as RadioIcon } from 'lucide-react';

type TabType = 'radio' | 'artists' | 'local' | 'favorites';
type ViewMode = 'grid' | 'detail';

export default function Home() {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('radio');
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [editingStation, setEditingStation] = useState<RadioStation | null>(null);
  const [isAddingStation, setIsAddingStation] = useState(false);
  
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
    // NO detener la reproducción - la música debe continuar entre menús
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
    setEditingStation(null);
    setIsAddingStation(false);
  };

  // CRUD Operations for Stations
  const handleAddStation = (station: RadioStation) => {
    const newStation = {
      ...station,
      stationuuid: `custom-${Date.now()}`
    };
    const updatedStations = [...stations, newStation];
    setStations(updatedStations);
    localStorage.setItem('radioworld-stations', JSON.stringify(
      updatedStations.filter(s => s.stationuuid.startsWith('custom-'))
    ));
    setIsAddingStation(false);
  };

  const handleUpdateStation = (updatedStation: RadioStation) => {
    const updatedStations = stations.map(s => 
      s.stationuuid === updatedStation.stationuuid ? updatedStation : s
    );
    setStations(updatedStations);
    localStorage.setItem('radioworld-stations', JSON.stringify(
      updatedStations.filter(s => s.stationuuid.startsWith('custom-'))
    ));
    setEditingStation(null);
  };

  const handleDeleteStation = (stationUuid: string) => {
    if (confirm('¿Estás seguro de eliminar esta estación?')) {
      const updatedStations = stations.filter(s => s.stationuuid !== stationUuid);
      setStations(updatedStations);
      localStorage.setItem('radioworld-stations', JSON.stringify(
        updatedStations.filter(s => s.stationuuid.startsWith('custom-'))
      ));
      if (playerState.currentStation?.stationuuid === stationUuid) {
        stopPlayback();
      }
    }
  };

  const handleClearAllData = () => {
    if (confirm('¿Estás seguro de borrar todos los datos guardados?')) {
      localStorage.removeItem('radioworld-favorites');
      localStorage.removeItem('radioworld-stations');
      clearFavorites();
      setStations([]);
      alert('Datos borrados correctamente');
    }
  };

  const handleLocalAudioReady = (audio: HTMLAudioElement) => {
    setLocalAudioElement(audio);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={handleTabChange} onOpenSettings={handleOpenSettings} />

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

      {/* Equalizer Panel - shown when audio is playing */}
      {(playerState.currentStation || playerState.currentSong || localAudioElement) && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-2">
          <div className="container mx-auto max-w-2xl">
            <Equalizer 
              audioElement={localAudioElement || undefined} 
              isActive={playerState.isPlaying || false}
            />
          </div>
        </div>
      )}

      {/* Settings Modal - Station Manager */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-zinc-900 border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  📻 Gestor de Estaciones
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseSettings}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Add Station Button */}
              <div className="mb-6">
                <Button
                  onClick={() => setIsAddingStation(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  + Agregar Nueva Estación
                </Button>
              </div>

              {/* Add Station Form */}
              {isAddingStation && (
                <StationForm
                  onSubmit={handleAddStation}
                  onCancel={() => setIsAddingStation(false)}
                />
              )}

              {/* Edit Station Form */}
              {editingStation && (
                <StationForm
                  station={editingStation}
                  onSubmit={handleUpdateStation}
                  onCancel={() => setEditingStation(null)}
                />
              )}

              {/* Stations List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <RadioIcon className="w-4 h-4" />
                  Estaciones Guardadas ({stations.length})
                </h3>
                
                {stations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay estaciones guardadas
                  </p>
                ) : (
                  stations.map((station) => (
                    <div
                      key={station.stationuuid}
                      className={`p-3 rounded-lg border transition-all ${
                        playerState.currentStation?.stationuuid === station.stationuuid
                          ? 'bg-purple-500/20 border-purple-500/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">
                            {station.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {station.country} • {station.tags?.split(',')[0] || 'Radio'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {/* Play button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePlayStation(station)}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                          >
                            ▶
                          </Button>
                          
                          {/* Edit button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingStation(station)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            ✏️
                          </Button>
                          
                          {/* Delete button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteStation(station.stationuuid)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Danger Zone */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Zona de Peligro
                </h4>
                <Button
                  variant="outline"
                  onClick={handleClearAllData}
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Borrar Todos los Datos
                </Button>
              </div>

              {/* Close Button */}
              <Button
                onClick={handleCloseSettings}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
