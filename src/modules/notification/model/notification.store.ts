import { ReactNode } from 'react';
import { create } from 'zustand';

type NotificationState = {
  timer: number;
  setTimer: (value: number) => void;
  icon: ReactNode | undefined;
  setIcon: (icon: ReactNode) => void;
  title: string;
  setTitle: (title: string) => void;
  isModalOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  callback: (() => void) | undefined;
  setCallback: (callback: (() => void) | undefined) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  timer: 1000,
  setTimer: (value): void => set({ timer: value }),
  isModalOpen: false,
  openPopup: (): void => set({ isModalOpen: true }),
  closePopup: (): void => set({ isModalOpen: false }),
  icon: undefined,
  setIcon: (icon): void => set({ icon: icon }),
  title: '',
  setTitle: (title): void => set({ title: title }),
  callback: undefined,
  setCallback: (callback: (() => void) | undefined): void => set({ callback: callback }),
}));
