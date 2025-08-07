import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favoritesCount: number;
  refreshFavoritesCount: () => Promise<void>;
  updateFavoritesCount: (increment: boolean) => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = useCallback(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  const refreshFavoritesCount = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoritesCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://143.198.212.38:5000/api/likes/user/liked-products', {
        params: { page: 1, limit: 1 }, // Just get count, not actual products
        headers: getAuthHeaders()
      });
      setFavoritesCount(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching favorites count:', error);
      setFavoritesCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);

  const updateFavoritesCount = useCallback((increment: boolean) => {
    setFavoritesCount(prev => increment ? prev + 1 : Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshFavoritesCount();
    } else {
      setFavoritesCount(0);
    }
  }, [isAuthenticated, refreshFavoritesCount]);

  return (
    <FavoritesContext.Provider value={{
      favoritesCount,
      refreshFavoritesCount,
      updateFavoritesCount,
      loading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}