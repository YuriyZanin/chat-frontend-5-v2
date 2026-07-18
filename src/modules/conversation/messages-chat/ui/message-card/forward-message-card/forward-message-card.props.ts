import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type ForwardMessageCardProps = {
  forwardMessageStore: RestMessageApi | null;
  clearForwardMessageStore: () => void;
};
