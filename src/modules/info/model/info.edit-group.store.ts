import { create } from 'zustand';

type InfoEditGroupState = {
  name: string;
  description: string;
  chatType?: 'public-group' | 'private-group' | 'public-channel' | 'private-channel';
  avatarUid?: string;
  avatarPreview?: string;
  hasChanges: boolean;
  isSaving: boolean;
  setGroupData: (data: Partial<Omit<InfoEditGroupState, 'setGroupData' | 'resetGroup'>>) => void;
  resetGroup: () => void;
};

export const useInfoEditGroupStore = create<InfoEditGroupState>((set) => ({
  name: '',
  description: '',
  chatType: undefined,
  avatarUid: undefined,
  avatarPreview: undefined,
  hasChanges: false,
  isSaving: false,
  setGroupData: (data: Partial<Omit<InfoEditGroupState, 'setGroupData' | 'resetGroup'>>): void =>
    set((state) => ({ ...state, ...data })),
  resetGroup: (): void =>
    set({
      name: '',
      description: '',
      chatType: undefined,
      avatarUid: undefined,
      avatarPreview: undefined,
      hasChanges: false,
      isSaving: false,
    }),
}));
