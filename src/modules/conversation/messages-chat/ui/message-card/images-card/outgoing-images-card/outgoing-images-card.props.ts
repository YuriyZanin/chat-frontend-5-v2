import { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list';
import type { RestMessageFileApi } from 'modules/conversation/messages-chat/model/messages-list/user-messages.api.schema';

export type OutgoingImagesCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
  search: string;
  isHighlighted: boolean | string;
  currentUserId: string;
};

export type PreviewImageCardProps = {
  image: RestMessageFileApi;
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
};

export type PlugCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
};
