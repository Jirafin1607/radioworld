'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { FavoriteItem, RadioStation, Artist } from '@/lib/types';

const FAVORITES_KEY = 'radioworld_favorites';

// External store for localStorage
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(FAVORITES_KEY) || '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

export function useFavorites() {
  // Use sync external store for localStorage
  const storedData = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  // Parse the stored data
  const parsedFavorites: FavoriteItem[] = storedData ? JSON.parse(storedData) : [];
  
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const favorites = parsedFavorites;

  const saveFavorites = useCallback((newFavorites: FavoriteItem[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setUpdateTrigger(prev => prev + 1); // Trigger re-render
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  const addFavorite = useCallback((item: RadioStation | Artist, type: 'station' | 'artist') => {
    const favoriteItem: FavoriteItem = {
      id: type === 'station' ? (item as RadioStation).stationuuid : (item as Artist).id,
      type,
      addedAt: new Date().toISOString(),
      data: item,
    };

    if (!favorites.some(f => f.id === favoriteItem.id)) {
      saveFavorites([...favorites, favoriteItem]);
    }
  }, [favorites, saveFavorites]);

  const removeFavorite = useCallback((id: string) => {
    saveFavorites(favorites.filter(f => f.id !== id));
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((id: string): boolean => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((item: RadioStation | Artist, type: 'station' | 'artist') => {
    const id = type === 'station' ? (item as RadioStation).stationuuid : (item as Artist).id;
    
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(item, type);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
