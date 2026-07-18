'use client';
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { MessagesListApiResponse, MessagesListQuery } from '../model/messages-list';
import { getMessagesList } from './messages-list.api';

const PAGE_SIZE = 25;

export const useMessagesListQuery = (
  user_uid: string,
  params: MessagesListQuery,
): UseInfiniteQueryResult<InfiniteData<MessagesListApiResponse>, unknown> => {
  return useInfiniteQuery<
    MessagesListApiResponse,
    unknown,
    InfiniteData<MessagesListApiResponse>,
    ['messages', 'messages-list', string, MessagesListQuery],
    number
  >({
    queryKey: ['messages', 'messages-list', user_uid, params],
    initialPageParam: 1,

    queryFn: ({ pageParam }) => {
      return getMessagesList(user_uid, {
        //...params,
        page: pageParam,
        page_size: PAGE_SIZE,
        search: params.search,
      });
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};
