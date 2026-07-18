import { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type IncomingImagesCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  register: (el: Element | null, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  search: string;
  isHighlighted: boolean | string;
  currentUserId: string;
};
