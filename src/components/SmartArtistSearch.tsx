'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Sparkles, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Artist } from '@/lib/types';

// Extended artist database with more artists for intelligent search
const EXTENDED_ARTIST_DB: Array<{name: string; genre: string; keywords: string[]}> = [
  // Mexican/Latin Artists
  { name: 'Los Ángeles Azules', genre: 'Cumbia, Sonidero', keywords: ['angeles', 'azul', 'azules', 'cumbia', 'sonidero'] },
  { name: 'Ángeles Negros', genre: 'Balada, Bolero', keywords: ['angeles', 'negros', 'balada', 'bolero', 'yolanda'] },
  { name: 'Los Ángeles de Charly', genre: 'Grupero, Cumbia', keywords: ['angeles', 'charly', 'grupero', 'cumbia'] },
  { name: 'Michael Jackson', genre: 'Pop, R&B, Soul', keywords: ['michael', 'jackson', 'king of pop', 'pop', 'thriller', 'billie jean'] },
  { name: 'Michael Bolton', genre: 'Pop Rock, Soft Rock', keywords: ['michael', 'bolton', 'soft rock', 'ballad', 'when a man loves a woman'] },
  { name: 'Michael Bublé', genre: 'Jazz Pop, Traditional Pop', keywords: ['michael', 'buble', 'bublé', 'jazz', 'christmas', 'home', 'feeling good'] },
  { name: 'George Michael', genre: 'Pop, Dance, Soul', keywords: ['george', 'michael', 'wham', 'faith', 'careless whisper'] },
  { name: 'Bad Bunny', genre: 'Reggaeton, Latin Trap', keywords: ['bad bunny', 'benito', 'reggaeton', 'trap latino', 'tití', 'conejo malo'] },
  { name: 'Maná', genre: 'Rock Latino, Pop Rock', keywords: ['mana', 'rock latino', 'mexico', 'guadalajara', 'rayando el sol', 'vivir sin aire'] },
  { name: 'Shakira', genre: 'Latin Pop, Reggaeton', keywords: ['shakira', 'colombia', 'barranquilla', 'hips dont lie', 'waka waka', 'chantaje'] },
  { name: 'Rosalía', genre: 'Flamenco, Pop Urbano', keywords: ['rosalia', 'rosalía', 'españa', 'flamenco', 'malamente', 'despecha'] },
  { name: 'Peso Pluma', genre: 'Corridos Tumbados', keywords: ['peso', 'pluma', 'corridos', 'tumbados', 'bellakeo'] },
  { name: 'Feid', genre: 'Reggaeton, Urbano', keywords: ['feid', 'ferxxo', 'reggaeton', 'castigo', 'morir solo'] },
  { name: 'Karol G', genre: 'Reggaeton, Urbano Latino', keywords: ['karol g', 'karol', 'reggaeton', 'bichota', 'tusa', 'provenza'] },
  { name: 'J Balvin', genre: 'Reggaeton, Urbano', keywords: ['j balvin', 'balvin', 'jose', 'reggaeton', 'mi gente', 'amarillo'] },
  { name: 'Ozuna', genre: 'Reggaeton, Latin Trap', keywords: ['ozuna', 'reggaeton', 'trap', 'taki taki', 'flex'] },
  { name: 'Daddy Yankee', genre: 'Reggaeton', keywords: ['daddy yankee', 'yankee', 'reggaeton', 'gasolina', 'loco', 'ramon'] },
  { name: 'Wisin & Yandel', genre: 'Reggaeton, Urbano', keywords: ['wisin', 'yandel', 'reggaeton', 'rakata', 'algo me gusta de ti'] },
  { name: 'Don Omar', genre: 'Reggaeton, Latin Urban', keywords: ['don omar', 'omar', 'reggaeton', 'danza kuduro', 'pobre diabla', 'hasta abajo'] },
  { name: 'Ricky Martin', genre: 'Latin Pop, Pop', keywords: ['ricky martin', 'ricky', 'livin la vida loca', 'la vida', 'puerto rico'] },
  { name: 'Enrique Iglesias', genre: 'Latin Pop, Pop', keywords: ['enrique', 'iglesias', 'hero', 'bailando', 'escapar', 'spanish'] },
  { name: 'Juanes', genre: 'Rock, Pop Latino', keywords: ['juanes', 'colombia', 'rock', 'la camisa negra', 'ayer'] },
  { name: 'Carlos Vives', genre: 'Vallenato, Pop', keywords: ['carlos vives', 'vallenato', 'colombia', 'la bicicleta', 'fruta fresca'] },
  { name: 'Marc Anthony', genre: 'Salsa, Pop Latino', keywords: ['marc anthony', 'salsa', 'vivo por ella', 'necio'] },
  { name: 'Luis Miguel', genre: 'Pop, Bolero, Mariachi', keywords: ['luis miguel', 'luismi', 'sol mexico', 'la incondicional', 'mexico'] },
  { name: 'Vicente Fernández', genre: 'Ranchera, Mariachi', keywords: ['vicente', 'fernandez', 'chente', 'ranchera', 'mexico', 'rey', 'volver volver'] },
  { name: 'Pedro Fernández', genre: 'Ranchera, Pop Latino', keywords: ['pedro', 'fernandez', 'ranchera', 'mexico', 'yo no fui'] },
  { name: 'Alejandro Fernández', genre: 'Pop, Ranchera', keywords: ['alejandro', 'fernandez', 'potrillo', 'ranchera', 'mexico'] },
  { name: 'Pepe Aguilar', genre: 'Ranchera, Regional Mexicano', keywords: ['pepe', 'aguilar', 'ranchera', 'mexico', 'por mujeres como tu'] },
  { name: 'Christian Nodal', genre: 'Mariachi, Regional Mexicano', keywords: ['christian', 'nodal', 'mariachi', 'adios amor', 'mexico'] },
  { name: 'Los Tigres del Norte', genre: 'Corrido, Norteño', keywords: ['tigres', 'norte', 'corrido', 'norteño', 'la reina del sur', 'mexico'] },
  { name: 'Banda MS', genre: 'Banda, Regional Mexicano', keywords: ['banda ms', 'banda', 'sinaloa', 'mexico', 'mejor de todas'] },
  { name: 'Banda El Recodo', genre: 'Banda, Regional Mexicano', keywords: ['recodo', 'banda', 'mexico', 'sinaloa', 'padre de las bandas'] },
  { name: 'Julión Álvarez', genre: 'Regional Mexicano, Banda', keywords: ['julion', 'julian', 'alvarez', 'taxista', 'mexico', 'banda'] },
  { name: 'Grupo Firme', genre: 'Regional Mexicano, Banda', keywords: ['grupo firme', 'firme', 'pedida', 'toxico', 'tijuana', 'mexico'] },
  { name: 'Los Bukis', genre: 'Grupero, Balada', keywords: ['bukis', 'marco antonio solis', 'grupero', 'a donde vas', 'tu carcel'] },
  { name: 'Marco Antonio Solís', genre: 'Grupero, Balada', keywords: ['marco', 'antonio', 'solis', 'el buki', 'si no te hubieras ido'] },
  { name: 'Los Temerarios', genre: 'Grupero, Balada', keywords: ['temerarios', 'grupero', 'juro que te amo'] },
  { name: 'Bronco - El Gigante de América', genre: 'Grupero', keywords: ['bronco', 'gigante', 'america', 'grupero', 'serpiente'] },
  { name: 'Café Tacvba', genre: 'Rock Alternativo', keywords: ['cafe tacuba', 'tacvba', 'rock', 'mexico', 'eres', 'la ingrata'] },
  { name: 'Caifanes / Jaguares', genre: 'Rock en Español', keywords: ['caifanes', 'jaguares', 'rock', 'mexico', 'la celula que explota', 'saul hernandez'] },
  { name: 'Molotov', genre: 'Rock, Punk, Alternative', keywords: ['molotov', 'rock', 'mexico', 'gimme th power', 'puto', 'frijolero'] },
  { name: 'Control Machete', genre: 'Hip Hop, Rap Latino', keywords: ['control machete', 'hip hop', 'rap', 'mexico', 'sí señor', 'danzón'] },
  { name: 'Calibre 50', genre: 'Norteño, Regional Mexicano', keywords: ['calibre 50', 'norteño', 'mexico', 'el tiempolo dira'] },
  { name: 'Los Tucanes de Tijuana', genre: 'Norteño, Corrido', keywords: ['tucanes', 'tijuana', 'norteño', 'corrido', 'mexico', 'la chica perfecta'] },
  { name: 'Rancho Humilde Artists', genre: 'Corridos Tumbados', keywords: ['rancho humilde', 'corridos', 'tumbados', 'fuerza regida', 'costa'] },
  { name: 'Fuerza Regida', genre: 'Corridos Tumbados', keywords: ['fuerza regida', 'corridos', 'tumbados', 'sabor fresa', 'mexico'] },
  { name: 'Becky G', genre: 'Reggaeton, Pop Latino', keywords: ['becky g', 'becky', 'reggaeton', 'mayores', 'shower'] },
  { name: 'Natti Natasha', genre: 'Reggaeton, Latin Pop', keywords: ['natti natasha', 'natti', 'reggaeton', 'criminal', 'ilumi'] },
  { name: 'Camilo', genre: 'Pop Latino, Ballad', keywords: ['camilo', 'pop', 'colombia', 'tutu', 'pegao', 'vida'] },
  { name: 'Sebastián Yatra', genre: 'Pop, Reggaeton', keywords: ['sebastian yatra', 'yatra', 'colombia', 'robarte un beso', 'contigo'] },
  { name: 'Maluma', genre: 'Reggaeton, Pop Latino', keywords: ['maluma', 'juan luis', 'colombia', 'felices los 4', 'hawái'] },
  { name: 'David Bisbal', genre: 'Pop, Balada', keywords: ['david bisbal', 'bisbal', 'espana', 'llorare las penas', 'digale'] },
  { name: 'Alejandro Sanz', genre: 'Pop, Flamenco', keywords: ['alejandro sanz', 'sanz', 'espana', 'corazon partio', 'amiga mia'] },
  { name: 'Romeo Santos', genre: 'Bachata', keywords: ['romeo santos', 'romeo', 'bachata', 'principe', 'propuesta indecente', 'aventura'] },
  { name: 'Prince Royce', genre: 'Bachata, Reggaeton', keywords: ['prince royce', 'royce', 'bachata', 'darte un beso', 'double vision'] },
  { name: 'Aventura', genre: 'Bachata', keywords: ['aventura', 'bachata', 'obsesion', 'when i see you', 'romeo'] },
  { name: 'Bruno Mars', genre: 'Pop, R&B', keywords: ['bruno mars', 'bruno', 'uptown funk', 'just the way you are', 'grenade'] },
  { name: 'The Weeknd', genre: 'R&B, Pop', keywords: ['weeknd', 'the weeknd', 'abel', 'blinding lights', 'save your tears', 'starboy'] },
  { name: 'Drake', genre: 'Hip Hop, R&B', keywords: ['drake', 'aubrey', 'god plan', 'hotline bling', 'one dance', 'canada'] },
  { name: 'Taylor Swift', genre: 'Pop, Country', keywords: ['taylor swift', 'taylor', 'shake it off', 'blank space', 'anti-hero'] },
  { name: 'Adele', genre: 'Pop, Soul', keywords: ['adele', 'hello', 'someone like you', 'rolling deep', 'uk'] },
  { name: 'Ed Sheeran', genre: 'Pop, Folk', keywords: ['ed sheeran', 'sheeran', 'shape of you', 'perfect', 'thinking out loud', 'uk'] },
  { name: 'Beyoncé', genre: 'R&B, Pop', keywords: ['beyonce', 'beyonce', 'crazy in love', 'halo', 'single ladies', 'formation'] },
  { name: 'Ariana Grande', genre: 'Pop, R&B', keywords: ['ariana grande', 'ariana', 'thank u next', '7 rings', 'positions'] },
  { name: 'Billie Eilish', genre: 'Pop, Alternative', keywords: ['billie eilish', 'billie', 'bad guy', 'ocean eyes', 'happy than ever'] },
  { name: 'Dua Lipa', genre: 'Pop, Dance', keywords: ['dua lipa', 'dua', 'levitating', 'dont start now', 'new rules'] },
  { name: 'Harry Styles', genre: 'Pop Rock', keywords: ['harry styles', 'harry', 'as it was', 'watermelon sugar', 'one direction'] },
  { name: 'Coldplay', genre: 'Alternative Rock, Pop', keywords: ['coldplay', 'yellow', 'fix you', 'viva la vida', 'chris martin', 'uk'] },
  { name: 'Imagine Dragons', genre: 'Alternative Rock, Pop', keywords: ['imagine dragons', 'radioactive', 'demons', 'believer', 'thunder'] },
  { name: 'Twenty One Pilots', genre: 'Alternative, Hip Hop', keywords: ['twenty one pilots', 'top', 'stressed out', 'ride', 'heathens'] },
  { name: 'Linkin Park', genre: 'Nu Metal, Rock', keywords: ['linkin park', 'numb', 'in the end', 'chester', 'shadow of the day'] },
  { name: 'Queen', genre: 'Rock Classic', keywords: ['queen', 'bohemian rhapsody', 'freddie mercury', 'we will rock you', 'uk'] },
  { name: 'The Beatles', genre: 'Rock Classic', keywords: ['beatles', 'john lennon', 'paul mccartney', 'hey jude', 'let it be', 'uk'] },
  { name: 'Pink Floyd', genre: 'Progressive Rock', keywords: ['pink floyd', 'comfortably numb', 'wall', 'dark side of moon', 'uk'] },
  { name: 'AC/DC', genre: 'Hard Rock', keywords: ['acdc', 'ac dc', 'highway to hell', 'back in black', 'australia'] },
  { name: 'Metallica', genre: 'Heavy Metal', keywords: ['metallica', 'enter sandman', 'nothing else matters', 'master of puppets'] },
  { name: 'Guns N Roses', genre: 'Hard Rock', keywords: ['guns n roses', 'gnr', 'sweet child o mine', 'november rain', 'axl rose'] },
  { name: 'Bon Jovi', genre: 'Hard Rock, Glam Metal', keywords: ['bon jovi', 'living on a prayer', "it's my life", 'always'] },
  { name: 'U2', genre: 'Rock Alternative', keywords: ['u2', 'with or without you', 'beautiful day', 'bono', 'ireland'] },
  { name: 'Red Hot Chili Peppers', genre: 'Funk Rock', keywords: ['red hot chili peppers', 'rhcp', 'californication', 'otherside', 'flea'] },
  { name: 'Nirvana', genre: 'Grunge, Alternative', keywords: ['nirvana', 'kurt cobain', 'smells like teen spirit', 'come as you are'] },
  { name: 'Eagles', genre: 'Rock, Country Rock', keywords: ['eagles', 'hotel california', 'take it easy', 'desperado'] },
  { name: 'Elton John', genre: 'Pop Rock', keywords: ['elton john', 'rocket man', 'tiny dancer', 'your song', 'uk'] },
  { name: 'Stevie Wonder', genre: 'Soul, R&B', keywords: ['stevie wonder', 'superstition', 'isnt she lovely', 'soul'] },
  { name: 'Whitney Houston', genre: 'Pop, R&B, Soul', keywords: ['whitney houston', 'whitney', 'i will always love you', 'greatest love of all'] },
  { name: 'Madonna', genre: 'Pop, Dance', keywords: ['madonna', 'material girl', 'like a virgin', 'vogue', 'la isla bonita'] },
  { name: 'Justin Bieber', genre: 'Pop, R&B', keywords: ['justin bieber', 'bieber', 'sorry', 'love yourself', 'baby', 'canada'] },
  { name: 'Shawn Mendes', genre: 'Pop', keywords: ['shawn mendes', 'shawn', 'senorita', 'stitches', 'treat you better', 'canada'] },
  { name: 'Charlie Puth', genre: 'Pop, R&B', keywords: ['charlie puth', 'charlie', 'attention', 'see you again', 'we dont talk anymore'] },
  { name: 'Post Malone', genre: 'Hip Hop, Pop Rock', keywords: ['post malone', 'post', 'circles', 'sunflower', 'rockstar', 'better now'] },
  { name: 'Kanye West', genre: 'Hip Hop, Rap', keywords: ['kanye west', 'kanye', 'ye', 'stronger', 'gold digger', 'donda'] },
  { name: 'Eminem', genre: 'Hip Hop, Rap', keywords: ['eminem', 'slim shady', 'lose yourself', 'without me', 'rap god', 'stan'] },
  { name: 'Jay-Z', genre: 'Hip Hop, Rap', keywords: ['jay z', 'jayz', '99 problems', 'empire state of mind', 'brooklyn'] },
  { name: 'Travis Scott', genre: 'Hip Hop, Trap', keywords: ['travis scott', 'travis', 'sicko mode', 'goosebumps', 'astroworld'] },
  { name: 'Kendrick Lamar', genre: 'Hip Hop, Rap', keywords: ['kendrick lamar', 'kendrick', 'humble', 'damn', 'good kid maad city'] },
  { name: 'Bad Bunny feat. Jhay Cortez - Dakiti', genre: 'Reggaeton', keywords: ['dakiti', 'bad bunny', 'jhay cortez'] },
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
  placeholder = 'Buscar artista... (ej: "Ángeles", "Michael")' 
}: SmartArtistSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intelligent search with fuzzy matching and relevance scoring
  const suggestions = useMemo(() => {
    if (!value || value.length < 2) return [];
    
    const query = value.toLowerCase().trim();
    const results: Array<{artist: typeof EXTENDED_ARTIST_DB[0]; score: number; matchType: string}> = [];

    EXTENDED_ARTIST_DB.forEach(artist => {
      let score = 0;
      let matchType = '';

      // Exact name match
      if (artist.name.toLowerCase() === query) {
        score = 100;
        matchType = 'exact';
      }
      // Name starts with query
      else if (artist.name.toLowerCase().startsWith(query)) {
        score = 90;
        matchType = 'starts-with';
      }
      // Name contains query
      else if (artist.name.toLowerCase().includes(query)) {
        score = 75;
        matchType = 'contains';
      }
      // Keyword matches
      else {
        for (const keyword of artist.keywords) {
          if (keyword.includes(query)) {
            score = Math.max(score, 60 + (keyword === query ? 20 : 10));
            matchType = 'keyword';
          }
          if (query.includes(keyword) && keyword.length > 3) {
            score = Math.max(score, 55);
            matchType = 'related';
          }
        }
        
        // Fuzzy matching for partial words
        const queryWords = query.split(/\s+/);
        const nameWords = artist.name.toLowerCase().split(/\s+/);
        for (const qw of queryWords) {
          if (qw.length >= 3) {
            for (const nw of nameWords) {
              if (nw.startsWith(qw) || nw.includes(qw)) {
                score = Math.max(score, 65);
                matchType = 'partial';
              }
              // Check Levenshtein-like similarity
              if (qw.length >= 4 && nw.length >= 4) {
                const similarity = calculateSimilarity(qw, nw);
                if (similarity > 0.6) {
                  score = Math.max(score, Math.round(similarity * 50));
                  matchType = 'similar';
                }
              }
            }
          }
        }
      }

      // Genre match bonus
      if (artist.genre.toLowerCase().includes(query)) {
        score = Math.max(score, 40);
        matchType = 'genre';
      }

      if (score > 0) {
        results.push({ artist, score, matchType });
      }
    });

    // Sort by score descending, then by name length for shorter names first
    return results
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.artist.name.length - b.artist.name.length;
      })
      .slice(0, 8); // Top 8 suggestions
  }, [value]);

  // Calculate string similarity (simple implementation)
  function calculateSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  function getEditDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s2.length; i++) {
      let lastValue = i;
      for (let j = 0; j < s1.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(j - 1) !== s2.charAt(i - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s1.length - 1] = lastValue;
    }
    return costs[s1.length - 1];
  }

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
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex].artist.name);
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

  const getMatchLabel = (matchType: string): string => {
    switch (matchType) {
      case 'exact': return 'Coincidencia exacta';
      case 'starts-with': return 'Comienza con';
      case 'contains': return 'Contiene';
      case 'keyword': return 'Palabra clave';
      case 'related': return 'Relacionado';
      case 'partial': return 'Coincidencia parcial';
      case 'similar': return 'Similar';
      case 'genre': return 'Género';
      default: return '';
    }
  };

  const getMatchColor = (matchType: string): string => {
    switch (matchType) {
      case 'exact': return 'text-green-400 bg-green-500/20';
      case 'starts-with': return 'text-blue-400 bg-blue-500/20';
      case 'contains': return 'text-purple-400 bg-purple-500/20';
      case 'keyword': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-white/5';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Icon */}
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
        showSuggestions && suggestions.length > 0 ? 'text-purple-400' : 'text-gray-400'
      }`} />
      
      {/* AI Badge when showing suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">
          <Sparkles className="w-3 h-3" />
          IA
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
          showSuggestions && suggestions.length > 0 ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
        }`}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => {
            onChange('');
            setShowSuggestions(false);
            inputRef.current?.focus();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {/* Header */}
            <div className="px-3 py-2 flex items-center gap-2 text-xs text-gray-500 border-b border-white/5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Búsqueda inteligente</span>
              <span className="ml-auto">{suggestions.length} resultados</span>
            </div>

            {/* Suggestions list */}
            {suggestions.map((result, index) => (
              <button
                key={result.artist.name}
                onClick={() => handleSelect(result.artist.name)}
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
                    {highlightMatch(result.artist.name, value)}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {result.artist.genre}
                  </div>
                </div>

                {/* Match badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getMatchColor(result.matchType)}`}>
                  {getMatchLabel(result.matchType)}
                </span>

                {/* Score indicator */}
                <div className="w-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      result.score >= 80 ? 'bg-green-400' :
                      result.score >= 60 ? 'bg-blue-400' :
                      result.score >= 40 ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(result.score, 100)}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="px-3 py-2 bg-black/30 border-t border-white/5 text-[10px] text-gray-600 text-center">
            ↑↓ para navegar · Enter para seleccionar · Esc para cerrar
          </div>
        </div>
      )}

      {/* No results state */}
      {showSuggestions && value.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-4 text-center">
          <p className="text-sm text-gray-400">No se encontraron artistas para "{value}"</p>
          <p className="text-xs text-gray-600 mt-1">Intenta con otro nombre o palabra clave</p>
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
