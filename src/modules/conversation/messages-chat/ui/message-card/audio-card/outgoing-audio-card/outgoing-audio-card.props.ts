import { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';

export type OutgoingAudioCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  search: string;
  isHighlighted: boolean | string;
  currentUserId: string;
};
