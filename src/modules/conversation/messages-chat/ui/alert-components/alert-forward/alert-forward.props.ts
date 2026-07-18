import type { Chat } from 'modules/conversation/chats/entity';

export type AlertForwardProps = {
  onOk: () => void;
  onCancel: () => void;
};
export type AlertForwardChatCardProps = {
  chat: Chat;
  onOk: () => void;
  clearSearch: () => void;
};
