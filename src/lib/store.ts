'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  setLocation: (location: string) => void;
  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  setGuests: (guests: number) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  location: '',
  checkIn: null,
  checkOut: null,
  guests: 2,
  setLocation: (location) => set({ location }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setGuests: (guests) => set({ guests }),
}));

interface FavoritesState {
  favorites: string[];
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (propertyId) =>
        set((state) => ({
          favorites: [...state.favorites, propertyId],
        })),
      removeFavorite: (propertyId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== propertyId),
        })),
      isFavorite: (propertyId) => get().favorites.includes(propertyId),
    }),
    {
      name: 'favorites-storage',
    }
  )
);


interface User {
  id: string;
  fullName: string;
  email: string;
  role: "traveller" | "owner";
  createdAt: Date;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // unique name for localStorage key
    }
  )
);