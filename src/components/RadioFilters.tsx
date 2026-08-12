'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { COUNTRIES, GENRES } from '@/lib/constants';

interface RadioFiltersProps {
  selectedCountry: string;
  selectedGenre: string;
  onCountryChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onClearFilters: () => void;
}

export function RadioFilters({
  selectedCountry,
  selectedGenre,
  onCountryChange,
  onGenreChange,
  onClearFilters,
}: RadioFiltersProps) {
  const hasFilters = selectedCountry || selectedGenre;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Filter className="w-4 h-4" />
        <span>Filtros:</span>
      </div>

      {/* Country filter */}
      <Select value={selectedCountry || 'all'} onValueChange={(value) => onCountryChange(value === 'all' ? '' : value)}>
        <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
          <SelectValue placeholder="Todos los países" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 max-h-[300px]">
          <SelectItem value="all">Todos los países</SelectItem>
          {COUNTRIES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.flag} {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Genre filter */}
      <Select value={selectedGenre || 'all'} onValueChange={(value) => onGenreChange(value === 'all' ? '' : value)}>
        <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
          <SelectValue placeholder="Todos los géneros" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 max-h-[300px]">
          <SelectItem value="all">Todos los géneros</SelectItem>
          {GENRES.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters button */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-400 hover:text-white gap-1"
        >
          <X className="w-4 h-4" />
          Limpiar
        </Button>
      )}

      {/* Active filters display */}
      {(selectedCountry || selectedGenre) && (
        <div className="flex items-center gap-2 ml-auto">
          {selectedCountry && (
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
              País: {COUNTRIES.find(c => c.code === selectedCountry)?.flag} {COUNTRIES.find(c => c.code === selectedCountry)?.name}
            </span>
          )}
          {selectedGenre && (
            <span className="px-2 py-1 text-xs bg-pink-500/20 text-pink-300 rounded-full">
              Género: {selectedGenre}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
