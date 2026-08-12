'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sliders, Power, Zap } from 'lucide-react';

interface EqualizerProps {
  audioElement?: HTMLAudioElement | null;
  isActive?: boolean;
}

const DEFAULT_BANDS = [
  { freq: 60, gain: 0, label: '60' },
  { freq: 170, gain: 0, label: '170' },
  { freq: 310, gain: 0, label: '310' },
  { freq: 600, gain: 0, label: '600' },
  { freq: 1000, gain: 0, label: '1K' },
  { freq: 3000, gain: 0, label: '3K' },
  { freq: 6000, gain: 0, label: '6K' },
  { freq: 12000, gain: 0, label: '12K' },
];

export function Equalizer({ audioElement, isActive = false }: EqualizerProps) {
  const [bands, setBands] = useState(DEFAULT_BANDS.map(b => b.gain));
  const [isEnabled, setIsEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBandChange = (index: number, value: number[]) => {
    setBands(prev => {
      const newBands = [...prev];
      newBands[index] = value[0];
      return newBands;
    });
  };

  return (
    <Card className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className={`w-5 h-5 ${isEnabled ? 'text-purple-400' : 'text-gray-500'}`} />
            <h3 className={`font-semibold ${isEnabled ? 'text-purple-300' : 'text-gray-400'}`}>
              Ecualizador
            </h3>
            {isEnabled && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-300">
                <Zap className="w-3 h-3" />
                Activo
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isEnabled ? "default" : "outline"}
              onClick={() => setIsEnabled(!isEnabled)}
              className={isEnabled 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                : "border-gray-500/30 text-gray-400"
              }
            >
              <Power className="w-4 h-4 mr-1" />
              {isEnabled ? 'ON' : 'OFF'}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white text-xs"
            >
              {isExpanded ? '▼' : '▲'}
            </Button>
          </div>
        </div>

        {/* Expanded EQ Bands */}
        {isExpanded && (
          <>
            {/* Presets */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Preconfiguraciones:</p>
              <div className="flex flex-wrap gap-2">
                {['Plano', 'Bass Boost', 'Treble', 'Vocal', 'Rock', 'Pop', 'Jazz'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      const presets: Record<string, number[]> = {
                        'Plano': [0, 0, 0, 0, 0, 0, 0, 0],
                        'Bass Boost': [6, 4, 2, 0, 0, 0, 0, 0],
                        'Treble': [0, 0, 0, 0, 2, 4, 6, 6],
                        'Vocal': [-2, -1, 0, 3, 4, 3, 0, 0],
                        'Rock': [5, 3, 0, -1, 2, 4, 5, 4],
                        'Pop': [-1, 2, 4, 4, 2, 0, -1, -1],
                        'Jazz': [4, 3, 1, 2, -1, 0, 1, 2],
                      };
                      if (presets[preset]) setBands(presets[preset]);
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* EQ Sliders */}
            <div className="flex items-end justify-between gap-2 pt-4">
              {DEFAULT_BANDS.map((band, index) => (
                <div key={band.freq} className="flex flex-col items-center gap-2 flex-1">
                  {/* Value */}
                  <span className={`text-xs font-medium ${
                    bands[index] > 0 ? 'text-green-400' : 
                    bands[index] < 0 ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    {bands[index] > 0 ? '+' : ''}{bands[index]}
                  </span>

                  {/* Visual bar */}
                  <div className="relative w-full h-24 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-200"
                      style={{ height: `${((bands[index] + 12) / 24) * 100}%` }}
                    />
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20" />
                  </div>

                  {/* Slider */}
                  <Slider
                    value={[bands[index]]}
                    min={-12}
                    max={12}
                    step={1}
                    onValueChange={(value) => handleBandChange(index, value)}
                    className="h-20 w-full [&_[role=slider]]:h-1 [&_[role=slider]]:bg-white/20"
                    orientation="vertical"
                  />

                  {/* Label */}
                  <span className="text-[10px] text-gray-500 font-medium">{band.label}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[9px] text-gray-600 mt-2 px-1">
              <span>Graves</span>
              <span>Medios</span>
              <span>Agudos</span>
            </div>
          </>
        )}

        {/* Collapsed mini visual */}
        {!isExpanded && isEnabled && (
          <div className="flex items-end justify-center gap-1 h-12 pt-2">
            {bands.slice(0, 8).map((gain, index) => (
              <div
                key={index}
                className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all opacity-70"
                style={{ height: `${((gain + 12) / 24) * 100}%` }}
              />
            ))}
          </div>
        )}

        {!isActive && (
          <p className="text-xs text-gray-600 text-center mt-2">
            Reproduce algo para activar el ecualizador
          </p>
        )}
      </CardContent>
    </Card>
  );
}
