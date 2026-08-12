'use client';

import { Radio, Music, Heart, Disc3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  activeTab: 'radio' | 'artists' | 'local' | 'favorites';
  onTabChange: (tab: 'radio' | 'artists' | 'local' | 'favorites') => void;
  onOpenSettings?: () => void;
}

export function Header({ activeTab, onTabChange, onOpenSettings }: HeaderProps) {
  const tabs = [
    { id: 'radio' as const, label: 'Radio', icon: Radio },
    { id: 'artists' as const, label: 'Artistas', icon: Music },
    { id: 'local' as const, label: 'Tu Música', icon: Disc3 },
    { id: 'favorites' as const, label: 'Favoritos', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                RadioWorld
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1">Música del mundo</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-white/5 rounded-full p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  activeTab === id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>

          {/* Settings Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
