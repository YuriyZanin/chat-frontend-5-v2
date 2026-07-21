import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { searchUsers } from 'modules/conversation/contacts/api';
import { UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { ContactSchemaApi } from 'modules/conversation/contacts/model/contact/search-contact.api.schema';
import { blockUser, getProfileInfoById, mapInfoProfileFromApi } from '.';
import { GroupInfo, ProfileInfo } from '../entity/info.entity';
import type { PaginatedMessageLinkListApi } from '../model/info.api.schema';
import {
  BlockProfileApiResponse,
  ChatPost,
  ChatPostApiResponse,
  GroupAvatarApiResponse,
  InviteLinkApiResponse,
  InviteSettingsPost,
  NewContact,
  PaginatedGroupChannelFileListApi,
  ParticipantApiResponse,
  UserForAddApiResponse,
} from '../model/info.api.schema';
import {
  addToContact,
  editChat,
  generateInvite,
  getChatFileList,
  getChatLinksList,
  getGroupOrChannel,
  getParticipantList,
  getUserForAddList,
  unblockUser,
  updateAvatar,
} from './info.api';
import { mapInfoGroupFromApi } from './info.group.mapper';

export const useInfoProfileQuery = (id: string): UseQueryResult<ProfileInfo> => {
  return useQuery({
    queryKey: ['info', 'contact', id],
    queryFn: async ({ signal }) => {
      return await getProfileInfoById(id, { signal });
    },

    select: (data) => mapInfoProfileFromApi(data),

    enabled: !!id && !id.startsWith('group') && !id.startsWith('channel'),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGroupOrChanelQuery = (chatKey: string): UseQueryResult<GroupInfo> => {
  return useQuery({
    queryKey: ['info', 'group', chatKey],
    queryFn: async ({ signal }) => {
      return await getGroupOrChannel(chatKey, { signal });
    },

    select: (data) => mapInfoGroupFromApi(data),

    enabled: !!chatKey,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchUserByNicknameQuery = (query: string): UseQueryResult<ContactSchemaApi[]> => {
  return useQuery({
    queryKey: ['search', 'user', query],
    queryFn: async ({ signal }) => {
      return (await searchUsers(query, { signal })).results;
    },

    enabled: !!query,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useBlockUserMutation = (id: string): UseMutationResult<BlockProfileApiResponse, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['block', 'contact', id],

    mutationFn: async () => {
      return await blockUser(id);
    },

    onSuccess: () => {
      console.log('Пользователь заблокирован');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['chats', 'chat-list'],
      });

      void queryClient.refetchQueries({
        queryKey: ['blacklist'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['info', 'contact', id],
      });
    },
  });
};

export const useUnblockUserMutation = (id: string): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['unblock', 'contact', id],

    mutationFn: async () => {
      await unblockUser(id);
    },

    onSuccess: () => {
      console.log('Пользователь разблокирован');
    },

    onError: (error: Error) => {
      console.error('Ошибка DELETE‑запроса:', error);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['chats', 'chat-list'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['blacklist'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['info', 'contact', id],
      });
    },
  });
};

export const useAddContactQuery = (): UseMutationResult<UserContactApiResponse, Error, NewContact> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add', 'contact'],

    mutationFn: async (contact) => {
      return await addToContact(contact);
    },

    onSuccess: () => {
      console.log('Пользователь добавлен в контакты');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', 'chat-list'] });
      queryClient.invalidateQueries({ queryKey: ['contacts', 'contacts-list'] });
    },
  });
};

export const useEditChatQuery = (chatId: number): UseMutationResult<ChatPostApiResponse, Error, ChatPost> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['edit', 'chat', chatId],

    mutationFn: async (chatPost) => {
      return await editChat(chatPost, chatId);
    },

    onSuccess: () => {
      console.log('Параметры чата изменены');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['chats', 'chat-list'],
      });
    },
  });
};

export const useGenerateInviteLinkQuery = (
  chatKey: string,
  inviteSetting: InviteSettingsPost,
): UseQueryResult<InviteLinkApiResponse> => {
  return useQuery({
    queryKey: ['generate', 'invite', chatKey],
    queryFn: async ({ signal }) => {
      console.log('Запрос на генерацию новой ссылки-приглашения');
      return await generateInvite(inviteSetting, chatKey, { signal });
    },

    enabled: !!chatKey,
    placeholderData: (previousData) => previousData,
    staleTime: inviteSetting.expires_in * 1000,
    retry: false,
  });
};

export const useParticipantsQuery = (
  query: string,
  chatKey: string,
): UseInfiniteQueryResult<InfiniteData<ParticipantApiResponse>, unknown> => {
  return useInfiniteQuery<
    ParticipantApiResponse,
    unknown,
    InfiniteData<ParticipantApiResponse>,
    ['participants', 'participants-list', string],
    number
  >({
    queryKey: ['participants', 'participants-list', chatKey],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getParticipantList(
        {
          page: pageParam,
          page_size: 15,
          search: query,
        },
        chatKey,
      ),

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },

    enabled: !!chatKey && (chatKey.startsWith('group') || chatKey.startsWith('channel')),
  });
};

export const useUserForAddQuery = (
  query: string,
  chatKey: string,
): UseInfiniteQueryResult<InfiniteData<UserForAddApiResponse>, unknown> => {
  return useInfiniteQuery<
    UserForAddApiResponse,
    unknown,
    InfiniteData<UserForAddApiResponse>,
    ['user-for-add', 'user-for-add-list', string],
    number
  >({
    queryKey: ['user-for-add', 'user-for-add-list', chatKey],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getUserForAddList({
        page: pageParam,
        page_size: 15,
        search: query,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};

export const useUpdateProfileAvatarQuery = (): UseMutationResult<GroupAvatarApiResponse, unknown, File> => {
  return useMutation({
    mutationFn: updateAvatar,
  });
};

export const useChatFilesListQuery = ({
  query,
  chatKey,
}: {
  query: string;
  chatKey: string;
}): UseInfiniteQueryResult<InfiniteData<PaginatedGroupChannelFileListApi>, unknown> => {
  return useInfiniteQuery<
    PaginatedGroupChannelFileListApi,
    unknown,
    InfiniteData<PaginatedGroupChannelFileListApi>,
    ['chat', 'files-list', string, string],
    number
  >({
    queryKey: ['chat', 'files-list', query, chatKey],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getChatFileList(
        {
          page: pageParam,
          page_size: 50,
          search: query,
        },
        chatKey,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};

export const useChatLinksListQuery = ({
  query,
  chatKey,
}: {
  query: string;
  chatKey: string;
}): UseInfiniteQueryResult<InfiniteData<PaginatedMessageLinkListApi>, unknown> => {
  return useInfiniteQuery<
    PaginatedMessageLinkListApi,
    unknown,
    InfiniteData<PaginatedMessageLinkListApi>,
    ['chat', 'files-list', string, string],
    number
  >({
    queryKey: ['chat', 'files-list', query, chatKey],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getChatLinksList(
        {
          page: pageParam,
          page_size: 50,
          search: query,
        },
        chatKey,
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};
