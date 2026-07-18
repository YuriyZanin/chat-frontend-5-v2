import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';
export type ForwardCardProps = {
  message: RestMessageApi | null;
  currentUserId: string;
};
export type CardProps = {
  message: RestMessageApi | null;
};
