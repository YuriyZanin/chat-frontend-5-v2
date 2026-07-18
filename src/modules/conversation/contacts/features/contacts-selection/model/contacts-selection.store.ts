import { create } from 'zustand';

type ContactsSelectionState = {
  isSelectionMode: boolean;
  isDeleteModalOpen: boolean;
  selectedIds: Set<string>;

  enterSelectionMode: () => void;
  exitSelectionMode: () => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export const useContactsSelectionStore = create<ContactsSelectionState>((set, get) => ({
  isSelectionMode: false,
  isDeleteModalOpen: false,
  selectedIds: new Set(),

  enterSelectionMode: (): void =>
    set({
      isSelectionMode: true,
      selectedIds: new Set(),
    }),

  exitSelectionMode: (): void =>
    set({
      isSelectionMode: false,
      selectedIds: new Set(),
    }),

  toggleSelection: (id): void =>
    set((state) => {
      const next = new Set(state.selectedIds);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return { selectedIds: next };
    }),

  clearSelection: (): void =>
    set({
      selectedIds: new Set(),
    }),

  openDeleteModal: (): void =>
    set({
      isDeleteModalOpen: true,
    }),

  closeDeleteModal: (): void =>
    set({
      isDeleteModalOpen: false,
    }),
}));
