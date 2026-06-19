import type { MessageLinkApi } from 'modules/info/model/info.api.schema';
import { ChatFilesListApi } from 'modules/info/model/info.api.schema';
export type InfoUploadsProps = {
  currentUid: string;
  chatKey?: string;
  wsUrl: string;
  tabs: string[];
  filesList: {
    imageFileList: ChatFilesListApi[] | undefined;
    fileFileList: ChatFilesListApi[] | undefined;
    voiceFileList: ChatFilesListApi[] | undefined;
    linksList: MessageLinkApi[] | undefined;
  };
  refreshUrl: string;
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
