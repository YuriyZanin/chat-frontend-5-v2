import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type ReplyCardProps = {
  message: RestMessageApi | null;
  isIncomingMessage: boolean;
};
