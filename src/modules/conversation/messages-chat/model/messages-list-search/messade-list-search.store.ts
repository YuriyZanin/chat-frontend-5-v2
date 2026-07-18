import { create } from 'zustand';

type MessagesListState = {
  from_me: boolean;
  setFromMe: (q: boolean) => void;
  new: boolean;
  setNew: (q: boolean) => void;
  ordering: string;
  setOrdering: (q: string) => void;
  clearOrdering: () => void;
  range_time_end_created: number;
  setRangeTimeEndCreated: (q: number) => void;
  range_time_end_updated: number;
  setRangeTimeEndUpdated: (q: number) => void;
  range_time_start_created: number;
  setRangeTimeStartCreated: (q: number) => void;
  range_time_start_updated: number;
  setRangeTimeStartUpdated: (q: number) => void;
  search: string;
  setSearch: (q: string) => void;
  clearSearch: () => void;
};

export const useMessagesListStore = create<MessagesListState>((set) => ({
  from_me: true,
  setFromMe: (from_me): void => set({ from_me: !from_me }),
  new: true,
  setNew: (newS): void => set({ new: !newS }),
  ordering: '',
  setOrdering: (ordering): void => set({ ordering }),
  clearOrdering: (): void => set({ ordering: '' }),
  range_time_end_created: 0,
  setRangeTimeEndCreated: (range_time_end_created): void => set({ range_time_end_created }),
  range_time_end_updated: 0,
  setRangeTimeEndUpdated: (range_time_end_updated): void => set({ range_time_end_updated }),
  range_time_start_created: 0,
  setRangeTimeStartCreated: (range_time_start_created): void => set({ range_time_start_created }),
  range_time_start_updated: 0,
  setRangeTimeStartUpdated: (range_time_start_updated): void => set({ range_time_start_updated }),
  search: '',
  setSearch: (search): void => set({ search }),
  clearSearch: (): void => set({ search: '' }),
}));
