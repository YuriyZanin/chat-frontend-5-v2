import { create } from 'zustand';

type CallsState = {
  avatarUrl: string | undefined;
  contactFio: string;
  messageRtcUid: string;
  offerSdp: string;
  answerSdp: string;
  fromUserUid: string;
  toUserUid: string;
  iceCandidates: string[];
  isCallModalOpen: boolean;
  isFullScreen: boolean;
  isIncomingModalOpen: boolean;
  isReceivingModalOpen: boolean;
  isSound: boolean;
  isShowVideo: boolean;
  hasRemoteVideo: boolean;
  duration: number;
  state: 'call' | 'connecting' | 'connected' | 'end' | 'error' | 'rejected' | 'unreceived';
  toggleCallsOpen: () => void;
  toggleFullScreen: () => void;
  toggleIncomingModalOpen: () => void;
  toggleReceivingModalOpen: () => void;
  toggleShowVideo: () => void;
  toggleSound: () => void;
  addCandidate: (candidateStr: string) => void;
  setDuration: (val: number) => void;
  setState: (val: 'call' | 'connecting' | 'connected' | 'end' | 'error' | 'rejected' | 'unreceived') => void;
  setCallData: (data: Partial<CallsState>) => void;
  resetCall: () => void;
};

export const useCallsStore = create<CallsState>((set, get) => ({
  avatarUrl: undefined,
  contactFio: '',
  messageRtcUid: '',
  offerSdp: '',
  answerSdp: '',
  fromUserUid: '',
  toUserUid: '',
  iceCandidates: [],
  isCallModalOpen: false,
  isFullScreen: false,
  isIncomingModalOpen: false,
  isReceivingModalOpen: false,
  isSound: true,
  isShowVideo: false,
  hasRemoteVideo: false,
  duration: 0,
  state: 'connecting',
  toggleCallsOpen: (): void => {
    const state = get();
    set({ isCallModalOpen: !state.isCallModalOpen });
  },
  toggleFullScreen: (): void => {
    const state = get();
    set({ isFullScreen: !state.isFullScreen });
  },
  toggleIncomingModalOpen: (): void => {
    const state = get();
    set({ isIncomingModalOpen: !state.isIncomingModalOpen });
  },
  toggleReceivingModalOpen: (): void => {
    const state = get();
    set({ isReceivingModalOpen: !state.isIncomingModalOpen });
  },
  toggleSound: (): void => {
    const state = get();
    set({ isSound: !state.isSound });
  },
  toggleShowVideo: (): void => {
    const state = get();
    set({ isShowVideo: !state.isShowVideo });
  },
  addCandidate: (candidateStr: string): void => {
    const state = get();
    set({ iceCandidates: [...state.iceCandidates, candidateStr] });
  },
  setDuration: (val: number): void => {
    set({ duration: val });
  },
  setState: (val: 'call' | 'connecting' | 'connected' | 'end' | 'error' | 'rejected' | 'unreceived'): void => {
    set({ state: val });
  },
  setCallData: (data: Partial<CallsState>): void => {
    set((state) => ({ ...state, ...data }));
  },
  resetCall: (): void => {
    set({
      avatarUrl: undefined,
      contactFio: '',
      messageRtcUid: '',
      offerSdp: '',
      answerSdp: '',
      fromUserUid: '',
      iceCandidates: [],
      isCallModalOpen: false,
      isFullScreen: false,
      isIncomingModalOpen: false,
      isReceivingModalOpen: false,
      isShowVideo: false,
      hasRemoteVideo: false,
      isSound: true,
      duration: 0,
      state: 'connecting',
    });
  },
}));
