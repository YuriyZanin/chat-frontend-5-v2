import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { ChatListApiResponse } from 'modules/conversation/chats/model/chat';
import { clearChat, deleteChat, getChatList } from './chat.api';

const PAGE_SIZE = 15;

export const useChatsQuery = ({
  search,
}: {
  search: string;
}): UseInfiniteQueryResult<InfiniteData<ChatListApiResponse>, unknown> => {
  return useInfiniteQuery<
    ChatListApiResponse,
    unknown,
    InfiniteData<ChatListApiResponse>,
    ['chats', 'chat-list', string],
    number
  >({
    queryKey: ['chats', 'chat-list', search],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getChatList({
        page: pageParam,
        page_size: PAGE_SIZE,
        search,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};

export const useDeleteChatMutation = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await deleteChat(id);
    },

    onSuccess: () => {
      console.log('Пользователь добавлен в контакты');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'messages-list'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['chats', 'chat-list'] });
    },
  });
};

type ClearChatBody = {
  is_favorite: boolean;
  last_message: {
    from_user: string;
    new: boolean;
  };
};

type ClearChatVars = {
  id: number;
  body?: ClearChatBody;
};

export const useClearChatMutation = (): UseMutationResult<void, Error, ClearChatVars> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ClearChatVars>({
    mutationFn: async ({ id, body }) => {
      await clearChat(id, body);
    },

    onSuccess: () => {
      console.log('Чат очищен');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'messages-list'], exact: false });
    },
  });
};
