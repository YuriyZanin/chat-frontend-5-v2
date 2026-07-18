import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type ForwardMessagesCardProps = {
  selectedMessagesStore: RestMessageApi[] | null;
  clearSelectedMessagesStore: () => void;
  currentUserId: string;
};
