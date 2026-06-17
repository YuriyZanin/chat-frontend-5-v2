import { create } from 'zustand';

type InfoState = {
  isInfoOpen: boolean;
  isBlockModalOpen: boolean;
  isUnblockModalOpen: boolean;
  isClearModalOpen: boolean;
  isForwardModalOpen: boolean;
  isDeleteParticipantModalOpen: boolean;
  isAddMembersMode: boolean;
  isGroupSettingsMode: boolean;
  isEditChatModalOpen: boolean;
  isLeaveGroupModalOpen: boolean;
  isDeleteGroupModalOpen: boolean;
  selectedIds: Set<string>;
  uid: string | undefined;
  setUid: (uid: string) => void;
  chatId: number | undefined;
  setChatId: (id: number) => void;
  uidToDelete: string | undefined;
  toggleInfoOpen: () => void;
  closeInfoScreen: () => void;
  openBlockModal: () => void;
  closeBlockModal: () => void;
  openUnblockModal: () => void;
  closeUnblockModal: () => void;
  openClearModal: () => void;
  closeClearModal: () => void;
  openForwardModal: () => void;
  closeForwardModal: () => void;
  openDeleteParticipantModal: (uid: string) => void;
  closeDeleteParticipantModal: () => void;
  openLeaveGroupModal: () => void;
  closeLeaveGroupModal: () => void;
  openDeleteGroupModal: () => void;
  closeDeleteGroupModal: () => void;
  openEditChatModal: () => void;
  closeEditChatModal: () => void;

  enterSettingsMode: () => void;
  exitSettingsMode: () => void;

  enterSelectionMode: () => void;
  exitSelectionMode: () => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  setIsInfoOpen: (isInfoOpen: boolean) => void;
};

export const useInfoStore = create<InfoState>((set, get) => ({
  isInfoOpen: false,
  isBlockModalOpen: false,
  isUnblockModalOpen: false,
  isClearModalOpen: false,
  isForwardModalOpen: false,
  isEditChatModalOpen: false,
  isDeleteParticipantModalOpen: false,
  isAddMembersMode: false,
  isGroupSettingsMode: false,
  isLeaveGroupModalOpen: false,
  isDeleteGroupModalOpen: false,
  selectedIds: new Set(),
  uid: undefined,
  setUid: (uid): void => {
    set({ uid: uid });
  },
  chatId: undefined,
  setChatId: (chatId): void => {
    set({ chatId: chatId });
  },
  uidToDelete: undefined,
  toggleInfoOpen: (): void => {
    const state = get();
    set({ isInfoOpen: !state.isInfoOpen });
  },
  setIsInfoOpen: (isInfoOpen: boolean): void => set({ isInfoOpen }),
  closeInfoScreen: (): void => set({ isInfoOpen: false }),
  openBlockModal: (): void => set({ isBlockModalOpen: true }),
  closeBlockModal: (): void => set({ isBlockModalOpen: false }),
  openUnblockModal: (): void => set({ isUnblockModalOpen: true }),
  closeUnblockModal: (): void => set({ isUnblockModalOpen: false }),
  openClearModal: (): void => set({ isClearModalOpen: true }),
  closeClearModal: (): void => set({ isClearModalOpen: false }),
  openForwardModal: (): void => set({ isForwardModalOpen: true }),
  closeForwardModal: (): void => set({ isForwardModalOpen: false }),
  openDeleteParticipantModal: (uid): void => set({ isDeleteParticipantModalOpen: true, uidToDelete: uid }),
  closeDeleteParticipantModal: (): void => set({ isDeleteParticipantModalOpen: false, uidToDelete: undefined }),
  openLeaveGroupModal: (): void => set({ isLeaveGroupModalOpen: true }),
  closeLeaveGroupModal: (): void => set({ isLeaveGroupModalOpen: false }),
  openDeleteGroupModal: (): void => set({ isDeleteGroupModalOpen: true }),
  closeDeleteGroupModal: (): void => set({ isDeleteGroupModalOpen: false }),
  openEditChatModal: (): void => set({ isEditChatModalOpen: true }),
  closeEditChatModal: (): void => set({ isEditChatModalOpen: false }),

  enterSettingsMode: (): void =>
    set({
      isGroupSettingsMode: true,
    }),

  exitSettingsMode: (): void =>
    set({
      isGroupSettingsMode: false,
    }),

  enterSelectionMode: (): void =>
    set({
      isAddMembersMode: true,
      selectedIds: new Set(),
    }),

  exitSelectionMode: (): void =>
    set({
      isAddMembersMode: false,
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
}));
