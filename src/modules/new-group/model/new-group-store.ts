import { create } from 'zustand';

export type EntityMode = 'group' | 'channel';
export type ChatType = 'public-group' | 'private-group' | 'public-channel' | 'private-channel';

type NewGroupState = {
  mode: EntityMode;
  name: string;
  description: string;
  chatType: ChatType | null;
  avatarUid: string | null;
  avatarPreview: string | null;
  avatarFile: File | null;
  setSelected: (selected: ChatType) => void;
  addSelected: (setSelected: (selected: ChatType) => void) => void;
  setMode: (mode: EntityMode) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setChatType: (chatType: ChatType | null) => void;
  setAvatarUid: (avatarUid: string | null) => void;
  setAvatarPreview: (avatarPreview: string | null) => void;
  setAvatarFile: (avatarFile: File | null) => void;
};

export const useNewGroupStore = create<NewGroupState>((set) => ({
  mode: 'group',
  name: '',
  description: '',
  chatType: null,
  avatarUid: null,
  avatarPreview: null,
  avatarFile: null,
  setSelected: (selected: ChatType): void => {},
  addSelected: (setSelected: (selected: ChatType) => void): void => set({ setSelected }),
  setMode: (mode: EntityMode): void => set({ mode }),
  setName: (name: string): void => set({ name }),
  setDescription: (description: string): void => set({ description }),
  setChatType: (chatType: ChatType | null): void => set({ chatType }),
  setAvatarUid: (avatarUid: string | null): void => set({ avatarUid }),
  setAvatarPreview: (avatarPreview: string | null): void => set({ avatarPreview }),
  setAvatarFile: (avatarFile: File | null): void => set({ avatarFile }),
}));
