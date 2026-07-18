import { create } from 'zustand';

type InfoSearchState = {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
};

export const useInfoSearchStore = create<InfoSearchState>((set) => ({
  query: '',
  setQuery: (query): void => set({ query }),
  clearQuery: (): void => set({ query: '' }),
}));
