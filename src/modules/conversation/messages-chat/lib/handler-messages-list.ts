import { getMessageDate } from 'modules/conversation/messages-chat/lib/get-message-date';
import type { RestMessageApi } from '../model/messages-list';

export const handlerMessagesList = (
  messagesList: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' })[],
): { [date: string]: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' })[] } => {
  const groupedMessagesList = messagesList.reduce<{
    [date: string]: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' })[];
  }>((acc, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => {
    const date = getMessageDate(message.created_at);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  return groupedMessagesList;
};
