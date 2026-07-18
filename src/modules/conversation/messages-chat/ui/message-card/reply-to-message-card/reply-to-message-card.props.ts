import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type ReplyToMessageCardProps = {
  repliedMessageStore: RestMessageApi | null;
  clearRepliedMessageStore: () => void;
};
