import { create } from 'zustand';
import type { Chat } from '../entity';

type ChatsListState = {
  chatsList: Chat[] | null;
  setChatsList: (chatList: Chat[]) => void;
  clearChatsList: () => void;
  addChatInChatsList: (chat: Chat) => void;
  deleteChatInChatsList: (id: number | undefined) => void;
  updateChatByUid: (request_uid: string, patch: Partial<Chat>) => void;
};

export const useChatsListStore = create<ChatsListState>((set) => ({
  chatsList: null,
  setChatsList: (chatsList: Chat[]): void =>
    set((s) => {
      const prev = s.chatsList ?? [];
      const seen = new Set();
      const result = [];
      for (const chat of prev) {
        const uid = chat.peer.uid;
        if (!seen.has(uid)) {
          seen.add(uid);
          result.push(chat);
        }
      }
      for (const chat of chatsList) {
        const uid = chat.peer.uid;
        if (!seen.has(uid)) {
          seen.add(uid);
          result.push(chat);
        }
      }
      return {
        chatsList: [...result],
      };
    }),
  clearChatsList: (): void =>
    set({
      chatsList: null,
    }),

  addChatInChatsList: (chat: Chat): void =>
    set((s) => {
      const prev = s.chatsList ?? [];
      const exists = prev.find((c) => c.peer.uid === chat.peer.uid);
      if (exists) {
        return {
          chatsList: [...prev],
        };
      }
      return { chatsList: [chat, ...prev] };
    }),

  deleteChatInChatsList: (id: number | undefined): void =>
    set((s) => {
      const prev = s.chatsList ?? [];
      const exists = prev.find((c) => c.chat.id === id);
      if (exists) {
        return {
          chatsList: [...prev.filter((c) => c.chat.id !== id)],
        };
      }
      return { chatsList: [...prev] };
    }),

  updateChatByUid: (request_uid: string, patch): void =>
    set((s) => {
      const prev = s.chatsList ?? [];
      return {
        chatsList: prev.map((chat) => (chat.peer.uid === request_uid ? { ...chat, ...patch } : chat)),
      };
    }),
}));
