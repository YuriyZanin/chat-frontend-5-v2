import { Msg } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
export type InfoUploadsProps = {
  currentUid: string;
  chatKey?: string;
  messagesByUser: Msg[];
  wsUrl: string;
};

type TabContentType = 'media' | 'files' | 'voices' | 'links' | 'members' | 'subscribers';

export type Tab = {
  id: TabContentType;
  title: string;
  content?: FileContent | LinkContent | VoiceContent;
};

export type FileContent = {
  id: number;
  file: string;
  url: string;
  size: string;
  type: string;
  created: string;
  isLoading?: boolean;
  progress?: number;
};

export type VoiceContent = {
  id: number;
  file: string;
  url: string;
  size: string;
  type: string;
  created: string;
  isPlaying?: boolean;
  audioRef?: HTMLAudioElement | null;
};

export type LinkContent = {
  messageId: number;
  url: string;
  title: string;
  fromUser: string;
  created: string;
};
