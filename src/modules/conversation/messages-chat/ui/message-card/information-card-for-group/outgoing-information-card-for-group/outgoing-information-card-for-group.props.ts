import type { RestMessageApi } from 'modules/conversation/messages-chat/model/messages-list/user-messages.api.schema';
export type OutgoingInformationForGroupCardProps = {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
};
