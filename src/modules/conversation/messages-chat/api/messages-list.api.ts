import { apiFetch } from 'shared/api';
import { MessagesListApiResponse, MessagesListQuery } from '../model/messages-list';

export const getMessagesList = (user_uid: string, params: MessagesListQuery): Promise<MessagesListApiResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;

    searchParams.set(key, String(value));
  });
  return apiFetch<MessagesListApiResponse>(
    `/api/proxy/api/v1/chat/message/text/${user_uid}/?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
};
