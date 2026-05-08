import type { Chat } from 'modules/conversation/chats/entity';
import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';
export type AlertOpenImagesProps = {
  onOk: () => void;
  onCancel: () => void;
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  isIncomingCard: boolean;
};

export type AlertForwardProps = {
  setIsForward: (f: boolean) => void;
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
};

export type AlertForwardChatCardProps = {
  chat: Chat;
  clearSearch: () => void;
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
};
