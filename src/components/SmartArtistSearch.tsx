'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Sparkles, Users, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Popular artists database for quick suggestions (supplements API search)
const POPULAR_ARTISTS: Array<{name: string; genre: string; keywords: string[]}> = [
  // Mexican/Latin Artists
  { name: 'Los Ángeles Azules', genre: 'Cumbia, Sonidero', keywords: ['angeles', 'azul', 'azules', 'cumbia'] },
  { name: 'Bad Bunny', genre: 'Reggaeton, Latin Trap', keywords: ['bad bunny', 'benito', 'reggaeton', 'trap'] },
  { name: 'Maná', genre: 'Rock Latino, Pop Rock', keywords: ['mana', 'rock latino', 'mexico'] },
  { name: 'Shakira', genre: 'Latin Pop, Reggaeton', keywords: ['shakira', 'colombia', 'hips dont lie'] },
  { name: 'Peso Pluma', genre: 'Corridos Tumbados', keywords: ['peso', 'pluma', 'corridos'] },
  { name: 'Karol G', genre: 'Reggaeton, Urbano Latino', keywords: ['karol g', 'reggaeton', 'bichota'] },
  { name: 'J Balvin', genre: 'Reggaeton, Urbano', keywords: ['j balvin', 'reggaeton', 'mi gente'] },
  { name: 'Daddy Yankee', genre: 'Reggaeton', keywords: ['daddy yankee', 'gasolina'] },
  { name: 'Ricky Martin', genre: 'Latin Pop, Pop', keywords: ['ricky martin', 'livin la vida loca'] },
  { name: 'Enrique Iglesias', genre: 'Latin Pop, Pop', keywords: ['enrique', 'iglesias', 'bailando'] },
  { name: 'Juanes', genre: 'Rock, Pop Latino', keywords: ['juanes', 'camisa negra'] },
  { name: 'Marc Anthony', genre: 'Salsa, Pop Latino', keywords: ['marc anthony', 'salsa'] },
  { name: 'Luis Miguel', genre: 'Pop, Bolero, Mariachi', keywords: ['luis miguel', 'sol mexico'] },
  { name: 'Vicente Fernández', genre: 'Ranchera, Mariachi', keywords: ['vicente', 'fernandez', 'chente', 'ranchera'] },
  { name: 'Christian Nodal', genre: 'Mariachi, Regional Mexicano', keywords: ['christian', 'nodal', 'adios amor'] },
  { name: 'Los Tigres del Norte', genre: 'Corrido, Norteño', keywords: ['tigres', 'norte', 'corrido'] },
  { name: 'Banda MS', genre: 'Banda, Regional Mexicano', keywords: ['banda ms', 'banda', 'sinaloa'] },
  { name: 'Grupo Firme', genre: 'Regional Mexicano, Banda', keywords: ['grupo firme', 'firme', 'pedida'] },
  { name: 'Los Bukis', genre: 'Grupero, Balada', keywords: ['bukis', 'marco antonio solis'] },
  { name: 'Café Tacvba', genre: 'Rock Alternativo', keywords: ['cafe tacuba', 'eres'] },
  // International Artists
  { name: 'Michael Jackson', genre: 'Pop, R&B, Soul', keywords: ['michael', 'jackson', 'pop', 'thriller'] },
  { name: 'Taylor Swift', genre: 'Pop, Country', keywords: ['taylor swift', 'shake it off'] },
  { name: 'The Weeknd', genre: 'R&B, Pop', keywords: ['weeknd', 'blinding lights'] },
  { name: 'Drake', genre: 'Hip Hop, R&B', keywords: ['drake', 'god plan'] },
  { name: 'Bruno Mars', genre: 'Pop, R&B', keywords: ['bruno mars', 'uptown funk'] },
  { name: 'Ed Sheeran', genre: 'Pop, Folk', keywords: ['ed sheeran', 'shape of you'] },
  { name: 'Adele', genre: 'Pop, Soul', keywords: ['adele', 'hello'] },
  { name: 'Beyoncé', genre: 'R&B, Pop', keywords: ['beyonce', 'crazy in love'] },
  { name: 'Coldplay', genre: 'Alternative Rock, Pop', keywords: ['coldplay', 'yellow'] },
  { name: 'Queen', genre: 'Rock Classic', keywords: ['queen', 'bohemian rhapsody'] },
  { name: 'The Beatles', genre: 'Rock Classic', keywords: ['beatles', 'hey jude'] },
  { name: 'Linkin Park', genre: 'Nu Metal, Rock', keywords: ['linkin park', 'numb'] },
  { name: 'Metallica', genre: 'Heavy Metal', keywords: ['metallica', 'enter sandman'] },
];

interface SmartArtistSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (artistName: string) => void;
  placeholder?: string;
}

export function SmartArtistSearch({ 
  value, 
  onChange, 
  onSelect,
  placeholder = 'Buscar cualquier artista... (ej: Bad Bunny, Queen, Los Bukis)' 
}: SmartArtistSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [apiResults, setApiResults] = useState<Array<{name: string; genre: string; source: string; keywords?: string[]}>>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Local suggestions from popular artists database
  const localSuggestions = useMemo(() => {
    if (!value || value.length < 2) return [];
    
    const query = value.toLowerCase().trim();
    const results: Array<{artist: typeof POPULAR_ARTISTS[0]; score: number}> = [];

    POPULAR_ARTISTS.forEach(artist => {
      let score = 0;

      if (artist.name.toLowerCase() === query) {
        score = 100;
      } else if (artist.name.toLowerCase().startsWith(query)) {
        score = 90;
      } else if (artist.name.toLowerCase().includes(query)) {
        score = 75;
      } else {
        for (const keyword of artist.keywords) {
          if (keyword.includes(query)) {
            score = Math.max(score, 60);
          }
        }
      }

      if (score > 0) {
        results.push({ artist, score });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(r => ({ ...r.artist, source: 'Popular' }));
  }, [value]);

  // Search API when user stops typing
  useEffect(() => {
    if (value.length < 3) {
      setApiResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingApi(true);
      try {
        const response = await fetch(`/api/artist/search?query=${encodeURIComponent(value)}`);
        const data = await response.json();
        
        if (data.artists && data.artists.length > 0) {
          // Filter out artists already in local suggestions
          const localNames = new Set(localSuggestions.map(a => a.name.toLowerCase()));
          const newResults = data.artists
            .filter((a: any) => !localNames.has(a.name.toLowerCase()))
            .slice(0, 5)
            .map((a: any) => ({
              name: a.name,
              genre: a.genre,
              source: 'iTunes'
            }));
          setApiResults(newResults);
        } else {
          setApiResults([]);
        }
      } catch (error) {
        console.error('API search error:', error);
        setApiResults([]);
      } finally {
        setIsLoadingApi(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, localSuggestions]);

  // Combine all suggestions
  const allSuggestions = useMemo(() => {
    const combined = [...localSuggestions];
    
    // Add API results that aren't already in the list
    const existingNames = new Set(combined.map(a => a.name.toLowerCase()));
    apiResults.forEach(result => {
      if (!existingNames.has(result.name.toLowerCase())) {
        combined.push({
          name: result.name,
          genre: result.genre,
          source: result.source,
          keywords: result.keywords || []
        });
      }
    });

    return combined.slice(0, 10);
  }, [localSuggestions, apiResults]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || allSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allSuggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allSuggestions.length) {
          handleSelect(allSuggestions[selectedIndex].name);
        } else if (value.length >= 2) {
          // Search with current text even if not in suggestions
          handleSelect(value);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (artistName: string) => {
    onChange(artistName);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(artistName);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Popular': return '⭐';
      case 'iTunes': return '🎵';
      default: return '🔍';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Popular': return 'text-yellow-400 bg-yellow-500/20';
      case 'iTunes': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-white/5';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Icon */}
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
        showSuggestions && allSuggestions.length > 0 ? 'text-purple-400' : 'text-gray-400'
      }`} />
      
      {/* Search type indicator */}
      {showSuggestions && allSuggestions.length > 0 && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">
          <Globe className="w-3 h-3" />
          Web
        </div>
      )}
      
      {/* Input */}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`pl-12 pr-16 py-3 bg-white/5 border-white/10 rounded-full text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all ${
          showSuggestions && allSuggestions.length > 0 ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
        }`}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => {
            onChange('');
            setShowSuggestions(false);
            setApiResults([]);
            inputRef.current?.focus();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {(allSuggestions.length > 0 || isLoadingApi || value.length >= 2) ? (
            <div className="p-2">
              {/* Header */}
              <div className="px-3 py-2 flex items-center gap-2 text-xs text-gray-500 border-b border-white/5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Resultados de búsqueda</span>
                <span className="ml-auto">{allSuggestions.length} encontrados</span>
              </div>

              {/* Loading state */}
              {isLoadingApi && (
                <div className="px-3 py-4 text-center text-gray-400 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Buscando en iTunes...
                </div>
              )}

              {/* Suggestions list */}
              {!isLoadingApi && allSuggestions.map((result, index) => (
                <button
                  key={`${result.source}-${result.name}`}
                  onClick={() => handleSelect(result.name)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    index === selectedIndex 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Artist icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === selectedIndex ? 'bg-purple-500/30' : 'bg-white/5'
                  }`}>
                    <Users className={`w-4 h-4 ${index === selectedIndex ? 'text-purple-300' : 'text-gray-400'}`} />
                  </div>

                  {/* Artist info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-white truncate">
                      {highlightMatch(result.name, value)}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {result.genre}
                    </div>
                  </div>

                  {/* Source badge */}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getSourceColor(result.source)}`}>
                    {getSourceIcon(result.source)} {result.source}
                  </span>
                </button>
              ))}

              {/* Search internet option when no exact match or to search freely */}
              {!isLoadingApi && value.length >= 2 && (
                <button
                  onClick={() => handleSelect(value)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1 hover:bg-white/5 transition-all border-t border-white/5 pt-3"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/10">
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-blue-300">
                      Buscar "{value}" en internet
                    </div>
                    <div className="text-xs text-gray-500">
                      Buscar este artista específico
                    </div>
                  </div>
                </button>
              )}

              {/* Footer hint */}
              <div className="px-3 py-2 bg-black/30 border-t border-white/5 text-[10px] text-gray-600 text-center mt-1">
                ↑↓ para navegar · Enter para seleccionar · Esc para cerrar
              </div>
            </div>
          ) : null}

          {/* Empty state only when too short */}
          {value.length > 0 && value.length < 2 && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-400">Ingresa al menos 2 caracteres</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Highlight matching text in search results
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-purple-500/40 text-purple-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
