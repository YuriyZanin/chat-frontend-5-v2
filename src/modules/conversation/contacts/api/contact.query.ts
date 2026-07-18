'use client';

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
import { Contact } from 'modules/conversation/contacts/entity';
import { UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { NewContact } from 'modules/info/model/info.api.schema';
import { mapSearchingContactFromApi } from '../model/contact/contact.mapper';
import { addToContact, getContactsList, searchUsers } from './contact.api';

const PAGE_SIZE = 15;

export const useContactsQuery = (): UseInfiniteQueryResult<InfiniteData<UserContactApiResponse>, unknown> => {
  return useInfiniteQuery<
    UserContactApiResponse,
    unknown,
    InfiniteData<UserContactApiResponse>,
    ['contacts', 'contacts-list'],
    number
  >({
    queryKey: ['contacts', 'contacts-list'],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getContactsList({
        page: pageParam,
        page_size: PAGE_SIZE,
        ordering: '-system_contact__was_online_at',
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};

export const useSearchUsersQuery = (query: string): UseQueryResult<Contact[]> => {
  return useQuery({
    queryKey: ['search', 'users', query],
    queryFn: async ({ signal }) => {
      return await searchUsers(query, { signal });
    },

    select: (data) => {
      if (query.length < 2) {
        return [];
      }
      return data.results.map(mapSearchingContactFromApi);
    },

    enabled: query.length >= 2,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
