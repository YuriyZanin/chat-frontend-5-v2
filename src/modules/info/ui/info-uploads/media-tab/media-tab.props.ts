import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';
import type { Msg } from 'modules/conversation/messages-chat/zustand-store/zustand-store';

export type MediaTabProps = {
  items: Msg[];
  currentUid: string;
  wsUrl: string;
};

export type MediaProps = {
  item: Msg;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
};
