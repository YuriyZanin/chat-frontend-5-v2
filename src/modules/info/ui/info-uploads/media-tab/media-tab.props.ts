import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';
import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';

export type MediaTabProps = {
  items: ChatFilesListApi[] | undefined;
  currentUid: string;
  wsUrl: string;
  refreshUrl: string;
};

export type MediaProps = {
  item: ChatFilesListApi;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
};
