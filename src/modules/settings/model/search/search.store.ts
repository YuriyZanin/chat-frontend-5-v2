import { create } from 'zustand';

type SearchState = {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query): void => set({ query }),
  clearQuery: (): void => set({ query: '' }),
}));
