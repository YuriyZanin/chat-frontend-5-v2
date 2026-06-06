import { create } from 'zustand';
import type { RestMessageApi } from '../model/messages-list';
import type { Attachment } from '../ui/context-menu/context-menu-attach-file/context-menu-attach-file.props';

export type Msg = RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };

type MessagesChatState = {
  messagesByUser: Record<string, Msg[]>;
  setMessagesForUser: (userId: string, messages: Msg[]) => void;
  clearMessagesForUser: (userId?: string) => void; // если userId не передан — очищает все
  addMessageForUser: (userId: string, m: Msg) => void;
  upsertMessageForUser: (userId: string, m: Msg) => void;
  updateMessageByUidForUser: (userId: string, request_uid: string, patch: Partial<Msg>) => void;
  deleteMessageByUidForUser: (userId: string, uid: string) => void;
};

export const useMessagesChatStore = create<MessagesChatState>((set) => ({
  messagesByUser: {},

  setMessagesForUser: (userId: string, messages: Msg[]): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      const seen = new Set();
      const result = [];
      for (const msg of prev) {
        const uid = msg.uid;
        if (!seen.has(uid)) {
          seen.add(uid);
          result.push(msg);
        }
      }
      for (const msg of messages) {
        const uid = msg.uid;
        if (!seen.has(uid)) {
          seen.add(uid);
          result.push(msg);
        }
      }
      return {
        messagesByUser: {
          ...s.messagesByUser,
          [userId]: result,
        },
      };
    }),

  clearMessagesForUser: (userId?: string): void =>
    set((s) => {
      if (typeof userId === 'string' && userId.length) {
        return { messagesByUser: { ...s.messagesByUser, [userId]: [] } };
      }
      return { messagesByUser: {} };
    }),

  addMessageForUser: (userId: string, m: Msg): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      return { messagesByUser: { ...s.messagesByUser, [userId]: [m, ...prev] } };
    }),

  upsertMessageForUser: (userId: string, m: Msg): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      const exists = prev.find((x) => x.uid === m.uid);
      if (exists) {
        return {
          messagesByUser: {
            ...s.messagesByUser,
            [userId]: prev.map((x) => (x.uid === m.uid ? { ...x, ...m } : x)),
          },
        };
      }
      return { messagesByUser: { ...s.messagesByUser, [userId]: [m, ...prev] } };
    }),

  updateMessageByUidForUser: (userId: string, request_uid: string, patch): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      return {
        messagesByUser: {
          ...s.messagesByUser,
          [userId]: prev.map((msg) => (msg.uid === request_uid ? { ...msg, ...patch } : msg)),
        },
      };
    }),

  deleteMessageByUidForUser: (userId: string, uid: string): void =>
    set((s) => {
      const prev = s.messagesByUser[userId] ?? [];
      const exists = prev.find((x) => x.uid === uid);
      if (exists) {
        return {
          messagesByUser: {
            ...s.messagesByUser,
            [userId]: prev.filter((x) => x.uid !== uid),
          },
        };
      }
      return { messagesByUser: { ...s.messagesByUser, [userId]: [...prev] } };
    }),
}));

type UserIdState = {
  userId: string;
  setUserId: (q: string) => void;
  clearUserId: () => void;
};

export const useUserIdStore = create<UserIdState>((set) => ({
  userId: '',
  setUserId: (userId): void => set({ userId }),
  clearUserId: (): void => set({ userId: '' }),
}));

type ForAllDelete = {
  forAllDelete: boolean | null;
  setForAllDelete: (q: boolean) => void;
};
export const useForAllDeleteStore = create<ForAllDelete>((set) => ({
  forAllDelete: null,
  setForAllDelete: (forAllDelete): void => set({ forAllDelete }),
}));

type RepliedMessageState = {
  repliedMessage: RestMessageApi | null;
  setRepliedMessage: (msg: RestMessageApi) => void;
  clearRepliedMessage: () => void;
};

export const useRepliedMessageStore = create<RepliedMessageState>((set) => ({
  repliedMessage: null,
  setRepliedMessage: (repliedMessage: RestMessageApi): void => set({ repliedMessage }),
  clearRepliedMessage: (): void => set({ repliedMessage: null }),
}));

type ForwardMessageState = {
  forwardMessage: RestMessageApi | null;
  setForwardMessage: (msg: RestMessageApi) => void;
  clearForwardMessage: () => void;
};

export const useForwardMessageStore = create<ForwardMessageState>((set) => ({
  forwardMessage: null,
  setForwardMessage: (forwardMessage: RestMessageApi): void => set({ forwardMessage }),
  clearForwardMessage: (): void => set({ forwardMessage: null }),
}));

type SelectedMessagesState = {
  selectedMessages: RestMessageApi[] | null;
  checkBoxsVisible: boolean | null;
  addSelectedMessages: (msg: RestMessageApi) => void;
  deleteSelectedMessages: (msg: RestMessageApi) => void;
  clearSelectedMessages: () => void;
  setCheckBoxsVisible: (v: boolean) => void;
  setSelectedMessages: (arr: RestMessageApi[] | null) => void;
};

export const useSelectedMessagesStore = create<SelectedMessagesState>((set) => ({
  selectedMessages: null,
  checkBoxsVisible: null,
  setCheckBoxsVisible: (checkBoxsVisible: boolean): void => set({ checkBoxsVisible }),
  setSelectedMessages: (selectedMessages: RestMessageApi[] | null): void => set({ selectedMessages }),
  addSelectedMessages: (msg: RestMessageApi): void =>
    set((s) => {
      const prev = s.selectedMessages ?? [];
      const exists = prev.find((m) => m.uid === msg.uid);
      if (!exists) {
        return { selectedMessages: [...prev, msg] };
      }
      return { selectedMessages: [...prev] };
    }),
  deleteSelectedMessages: (msg: RestMessageApi): void =>
    set((s) => {
      const prev = s.selectedMessages ?? [];
      const exists = prev.find((m) => m.uid === msg.uid);
      if (exists) {
        return {
          selectedMessages: prev.filter((m) => m.uid !== msg.uid),
        };
      }
      return { selectedMessages: [...prev] };
    }),

  clearSelectedMessages: (): void => set({ selectedMessages: null }),
}));

type RecentEmojiState = {
  recentEmojis: string[];
  setRecentEmojis: (recentEmoji: string[]) => void;
  clearRecentEmojis: () => void;
};

export const useRecentEmojiStore = create<RecentEmojiState>((set) => ({
  recentEmojis: [],
  setRecentEmojis: (recentEmojis: string[]): void => set({ recentEmojis }),
  clearRecentEmojis: (): void => set({ recentEmojis: [] }),
}));

type SelectedUidUserForForwardMessageState = {
  selectedUidUserForForwardMessage: string;
  setSelectedUidUserForForwardMessage: (uid: string) => void;
  clearSelectedUidUserForForwardMessage: () => void;
};

export const useSelectedUidUserForForwardMessageStore = create<SelectedUidUserForForwardMessageState>((set) => ({
  selectedUidUserForForwardMessage: '',
  setSelectedUidUserForForwardMessage: (uid: string): void => set({ selectedUidUserForForwardMessage: uid }),
  clearSelectedUidUserForForwardMessage: (): void => set({ selectedUidUserForForwardMessage: '' }),
}));

type ToastVisibleState = {
  toastVisible: boolean;
  setToastVisible: (toastVisible: boolean) => void;
};
export const useToastVisibleStore = create<ToastVisibleState>((set) => ({
  toastVisible: false,
  setToastVisible: (toastVisible): void => set({ toastVisible }),
}));
type SearchMessagesState = {
  searchMessages: string;
  setSearchMessages: (searchMessages: string) => void;
  clearSearchMessages: () => void;
};

export const useSearchMessagesStore = create<SearchMessagesState>((set) => ({
  searchMessages: '',
  setSearchMessages: (searchMessages: string): void => set({ searchMessages }),
  clearSearchMessages: (): void => set({ searchMessages: '' }),
}));

type GoToNextSearchMessageState = {
  goToNextSearchMessage: (() => void) | null;
  setGoToNextSearchMessage: (goToNextSearchMessage: () => void) => void;
  clearGoToNextSearchMessage: () => void;
};

export const useGoToNextSearchMessageStore = create<GoToNextSearchMessageState>((set) => ({
  goToNextSearchMessage: null,
  setGoToNextSearchMessage: (goToNextSearchMessage: () => void | null): void => set({ goToNextSearchMessage }),
  clearGoToNextSearchMessage: (): void => set({ goToNextSearchMessage: null }),
}));

type GoToPrevSearchMessageState = {
  goToPrevSearchMessage: (() => void) | null;
  setGoToPrevSearchMessage: (goToPrevSearchMessage: () => void) => void;
  clearGoToPrevSearchMessage: () => void;
};

export const useGoToPrevSearchMessageStore = create<GoToPrevSearchMessageState>((set) => ({
  goToPrevSearchMessage: null,
  setGoToPrevSearchMessage: (goToPrevSearchMessage: (() => void) | null): void => set({ goToPrevSearchMessage }),
  clearGoToPrevSearchMessage: (): void => set({ goToPrevSearchMessage: null }),
}));

type SearchIndicatorState = {
  searchIndicator: {
    currentSearchIndex: number;
    lastSearchIndex: number;
  } | null;
  setSearchIndicator: (
    searchIndicator: {
      currentSearchIndex: number;
      lastSearchIndex: number;
    } | null,
  ) => void;
  clearSearchIndicator: () => void;
};

export const useSearchIndicatorStore = create<SearchIndicatorState>((set) => ({
  searchIndicator: null,
  setSearchIndicator: (
    searchIndicator: {
      currentSearchIndex: number;
      lastSearchIndex: number;
    } | null,
  ): void => set({ searchIndicator }),
  clearSearchIndicator: (): void => set({ searchIndicator: null }),
}));

type HeaderButtonsModalState = {
  isBlockModalOpen: boolean;
  openBlockModal: () => void;
  closeBlockModal: () => void;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  isButtonMenuOpen: boolean;
  openButtonMenu: () => void;
  closeButtonMenu: () => void;
  isLeaveGroupModalOpen: boolean;
  openLeaveGroupModal: () => void;
  closeLeaveGroupModal: () => void;
};

export const useHeaderButtonsModalStore = create<HeaderButtonsModalState>((set) => ({
  isBlockModalOpen: false,
  openBlockModal: (): void => set({ isBlockModalOpen: true }),
  closeBlockModal: (): void => set({ isBlockModalOpen: false }),
  isAddModalOpen: false,
  openAddModal: (): void => set({ isAddModalOpen: true }),
  closeAddModal: (): void => set({ isAddModalOpen: false }),
  isButtonMenuOpen: false,
  openButtonMenu: (): void => set({ isButtonMenuOpen: true }),
  closeButtonMenu: (): void => set({ isButtonMenuOpen: false }),
  isLeaveGroupModalOpen: false,
  openLeaveGroupModal: (): void => set({ isLeaveGroupModalOpen: true }),
  closeLeaveGroupModal: (): void => set({ isLeaveGroupModalOpen: false }),
}));

type AttachmentFilesState = {
  attachmentFiles: Attachment[];
  setAttachmentFiles: (value: Attachment[] | ((prev: Attachment[]) => Attachment[])) => void;
  clearAttachmentFiles: () => void;
  deleteAttachmentFiles: (id: string) => void;
};

export const useAttachmentFilesStore = create<AttachmentFilesState>((set) => ({
  attachmentFiles: [],
  setAttachmentFiles: (value): void =>
    set((s) => ({
      attachmentFiles: typeof value === 'function' ? value(s.attachmentFiles) : value,
    })),
  clearAttachmentFiles: (): void => set({ attachmentFiles: [] }),
  deleteAttachmentFiles: (id: string): void =>
    set((s) => {
      const prev = s.attachmentFiles;
      const exists = prev.find((f) => f.id === id);
      if (exists) {
        return {
          attachmentFiles: prev.filter((f) => f.id !== id),
        };
      }
      return { attachmentFiles: [...prev] };
    }),
}));

type TextForAttachmentFilesState = {
  textForAttachmentFiles: string;
  setTextForAttachmentFiles: (textForAttachmentFiles: string) => void;
  clearTextForAttachmentFiles: () => void;
};

export const useTextForAttachmentFilesStore = create<TextForAttachmentFilesState>((set) => ({
  textForAttachmentFiles: '',
  setTextForAttachmentFiles: (textForAttachmentFiles: string): void => set({ textForAttachmentFiles }),
  clearTextForAttachmentFiles: (): void => set({ textForAttachmentFiles: '' }),
}));

type AudioFilesState = {
  audioFiles: Attachment[];
  setAudioFiles: (value: Attachment[]) => void;
  clearAudioFiles: () => void;
};

export const useAudioFilesStore = create<AudioFilesState>((set) => ({
  audioFiles: [],
  setAudioFiles: (audioFiles): void => set({ audioFiles }),
  clearAudioFiles: (): void => set({ audioFiles: [] }),
}));

type AudioPlayerState = {
  currentPlayingId: string | null;
  currentPlayingRef: React.MutableRefObject<(() => void) | null> | null;
  setCurrentPlaying: (id: string | null, stopCallback?: () => void) => void;
  stopCurrentPlaying: () => void;
};

export const useAudioManagerStore = create<AudioPlayerState>((set, get) => ({
  currentPlayingId: null,
  currentPlayingRef: null,
  setCurrentPlaying: (id, stopCallback?): void => {
    const { currentPlayingRef, currentPlayingId } = get();

    // Если уже есть воспроизведение и это не тот же трек
    if (currentPlayingId && currentPlayingId !== id) {
      // Останавливаем предыдущее воспроизведение
      if (currentPlayingRef?.current) {
        currentPlayingRef.current();
      }
    }
    set({
      currentPlayingId: id,
      currentPlayingRef: stopCallback ? { current: stopCallback } : null,
    });
  },
  stopCurrentPlaying: (): void => {
    const { currentPlayingRef } = get();
    if (currentPlayingRef?.current) {
      currentPlayingRef.current();
    }
    set({ currentPlayingId: null, currentPlayingRef: null });
  },
}));

type AttachmentImagesState = {
  attachmentImages: Attachment[];
  setAttachmentImages: (value: Attachment[] | ((prev: Attachment[]) => Attachment[])) => void;
  clearAttachmentImages: () => void;
  deleteAttachmentImages: (id: string) => void;
};

export const useAttachmentImagesStore = create<AttachmentImagesState>((set) => ({
  attachmentImages: [],
  setAttachmentImages: (value): void =>
    set((s) => ({
      attachmentImages: typeof value === 'function' ? value(s.attachmentImages) : value,
    })),
  clearAttachmentImages: (): void => set({ attachmentImages: [] }),
  deleteAttachmentImages: (id: string): void =>
    set((s) => {
      const prev = s.attachmentImages;
      const exists = prev.find((f) => f.id === id);
      if (exists) {
        return {
          attachmentImages: prev.filter((f) => f.id !== id),
        };
      }
      return { attachmentImages: [...prev] };
    }),
}));

type TextForAttachmentImagesState = {
  textForAttachmentImages: string;
  setTextForAttachmentImages: (textForAttachmentImages: string) => void;
  clearTextForAttachmentImages: () => void;
};

export const useTextForAttachmentImagesStore = create<TextForAttachmentImagesState>((set) => ({
  textForAttachmentImages: '',
  setTextForAttachmentImages: (textForAttachmentImages: string): void => set({ textForAttachmentImages }),
  clearTextForAttachmentImages: (): void => set({ textForAttachmentImages: '' }),
}));

type IsDeletedFileState = {
  isDeletedFile: boolean;
  setIsDeletedFile: (isDeletedFile: boolean) => void;
};
export const useIsDeletedFileStore = create<IsDeletedFileState>((set) => ({
  isDeletedFile: false,
  setIsDeletedFile: (isDeletedFile: boolean): void => set({ isDeletedFile }),
}));
