import { create } from 'zustand';

export type EntityMode = 'group' | 'channel';
export type ChatType = 'public-group' | 'private-group' | 'public-channel' | 'private-channel';

type NewGroupState = {
  mode: EntityMode;
  name: string;
  description: string;
  chatType: ChatType;
  avatarUid: string | null;
  avatarPreview: string | null;
  avatarFile: File | null;
  setMode: (mode: EntityMode) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setChatType: (chatType: ChatType) => void;
  setAvatarUid: (avatarUid: string) => void;
  setAvatarPreview: (avatarPreview: string) => void;
  setAvatarFile: (avatarFile: File) => void;
};

export const useNewGroupStore = create<NewGroupState>((set) => ({
  mode: 'group',
  name: '',
  description: '',
  chatType: 'public-group',
  avatarUid: null,
  avatarPreview: null,
  avatarFile: null,
  setMode: (mode: EntityMode): void => set({ mode }),
  setName: (name: string): void => set({ name }),
  setDescription: (description: string): void => set({ description }),
  setChatType: (chatType: ChatType): void => set({ chatType }),
  setAvatarUid: (avatarUid: string): void => set({ avatarUid }),
  setAvatarPreview: (avatarPreview: string): void => set({ avatarPreview }),
  setAvatarFile: (avatarFile: File): void => set({ avatarFile }),
}));
