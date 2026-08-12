'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioStation } from '@/lib/types';
import { Save, X, Radio as RadioIcon } from 'lucide-react';

interface StationFormProps {
  station?: RadioStation | null;
  onSubmit: (station: RadioStation) => void;
  onCancel: () => void;
}

export function StationForm({ station, onSubmit, onCancel }: StationFormProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [country, setCountry] = useState('');
  const [tags, setTags] = useState('');
  const [homepage, setHomepage] = useState('');
  const [favicon, setFavicon] = useState('');

  useEffect(() => {
    if (station) {
      setName(station.name || '');
      setUrl(station.url || '');
      setCountry(station.country || '');
      setTags(station.tags || '');
      setHomepage(station.homepage || '');
      setFavicon(station.favicon || '');
    }
  }, [station]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      alert('Por favor ingresa al menos el nombre y la URL de la estación');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      alert('Por favor ingresa una URL válida (ej: https://stream.example.com/radio)');
      return;
    }

    const stationData: RadioStation = {
      stationuuid: station?.stationuuid || '',
      name: name.trim(),
      url: url.trim(),
      url_resolved: url.trim(),
      country: country.trim() || 'Personalizada',
      countrycode: '',
      tags: tags.trim() || 'Personalizada',
      state: '',
      language: '',
      codec: 'MP3',
      bitrate: 128,
      hls: 0,
      lastcheckok: 1,
      lastchecktime: new Date().toISOString(),
      clickcount: 0,
      clicktrend: 0,
      homepage: homepage?.trim() || '',
      favicon: favicon?.trim() || '',
    };

    onSubmit(stationData);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <RadioIcon className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">
            {station ? 'Editar Estación' : 'Nueva Estación'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre de la estación *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Mi Radio Favorita"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                País
              </label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="ej: México, España..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          {/* Stream URL - Most important field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              URL del Stream *
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://streaming.example.com:8000/radio.mp3"
              className="bg-white/5 border-white/10 text-white"
              required
              type="url"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL directa del stream de audio (MP3, AAC, OGG)
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Géneros / Tags
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ej: Pop, Rock, Latino (separados por comas)"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Homepage */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Página web
              </label>
              <Input
                value={homepage || ''}
                onChange={(e) => setHomepage(e.target.value)}
                placeholder="https://www.miradio.com (opcional)"
                className="bg-white/5 border-white/10 text-white"
                type="url"
              />
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Logo URL
              </label>
              <Input
                value={favicon || ''}
                onChange={(e) => setFavicon(e.target.value)}
                placeholder="URL del logo (opcional)"
                className="bg-white/5 border-white/10 text-white"
                type="url"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Save className="w-4 h-4" />
              {station ? 'Guardar Cambios' : 'Agregar Estación'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-500/30 text-gray-400 hover:bg-white/5"
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
