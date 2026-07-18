import { ChatListApiResponse, ChatQuery } from 'modules/conversation/chats/model/chat';
import { apiFetch } from 'shared/api';

export const getChatList = (params: ChatQuery): Promise<ChatListApiResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;

    searchParams.set(key, String(value));
  });
  return apiFetch<ChatListApiResponse>(`/api/proxy/api/v1/chat/list/?${searchParams.toString()}`, {
    method: 'GET',
  });
};

export const deleteChat = async (id: number): Promise<void> => {
  await apiFetch<void>(`/api/proxy/api/v1/chat/list/${id}/`, { method: 'DELETE' });
};

export const clearChat = async (
  id: number,
  body?: {
    is_favorite: boolean;
    last_message: {
      from_user: string;
      new: boolean;
    };
  },
): Promise<void> => {
  await apiFetch<void>(`/api/proxy/api/v1/chat/list/clear/${id}/`, { method: 'POST', body: JSON.stringify(body) });
};
