import { ChatType } from 'modules/conversation/chats/model/chat';

type PeerEntity = {
  uid: string;

  username: string | undefined;
  nickname: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;

  avatarUrl: string;
  avatarWebpUrl: string;

  isBlocked: boolean;
  isOnline: boolean;
  isInContacts: boolean;

  wasOnlineAt: number | null;
};

export type ChatEntity = {
  id: number;
  chatKey: string;
  chatType: ChatType;
  name: string;
  is_favorite: boolean | undefined;
  notifications: boolean;
  newMessageCount: number;
  lastActivityAt: number;
};

type BaseMessageEntity = {
  id: number;
  uid: string;
};

export type AttachmentKind = 'image' | 'video' | 'audio' | 'file';
export type FilesSummaryEntity = {
  types: AttachmentKind[];
  count: number;
};

type LastMessageEntity = BaseMessageEntity & {
  fromUser: string;
  content: string;

  filesSummary: FilesSummaryEntity;
  hasRepliedMessage: boolean;
  hasForwardedMessage: boolean;
  new: boolean | undefined;
  createdAt: number;
  updatedAt: number;
};

export type Chat = {
  peer: PeerEntity;
  chat: ChatEntity;
  messages: {
    lastSeenMessage?: BaseMessageEntity;
    firstNewMessage?: BaseMessageEntity;
    lastMessage?: LastMessageEntity;
  };
};
