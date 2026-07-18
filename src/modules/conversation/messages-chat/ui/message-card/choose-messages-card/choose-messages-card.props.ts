import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type ChooseMessagesCardProps = {
  setCheckBoxsVisibleStore: (v: boolean) => void;
  selectedMessagesStore: RestMessageApi[] | null;
  clearSelectedMessagesStore: () => void;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
};
