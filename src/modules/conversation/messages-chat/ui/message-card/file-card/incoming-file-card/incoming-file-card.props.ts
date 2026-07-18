import { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type IncomingFileCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  register: (el: Element | null, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
  search: string;
  isHighlighted: boolean | string;
  currentUserId: string;
};
