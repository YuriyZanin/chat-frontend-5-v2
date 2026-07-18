'use client';

import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { useDebouncedValue } from 'modules/conversation/shared/hooks';
import { useMemo } from 'react';
import { useMessagesListQuery } from '../api/messages-list.query';
import type { RestMessageApi } from '../model/messages-list';
import { MessagesListApiResponse } from '../model/messages-list';
import { useSearchMessagesStore } from '../zustand-store/zustand-store';

type UseMessagesListSearchScreenReturn = {
  searchMessagesStore: string;
  setSearchMessagesStore: (q: string) => void;
  clearSearchMessagesStore: () => void;
  messagesListSearch: RestMessageApi[];
  statusSearch: string;
  fetchNextPageSearch: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<MessagesListApiResponse>, unknown>>;
  hasNextPageSearch: boolean;
  isFetchingNextPageSearch: boolean;
  isLoadingSearch: boolean;
  uidMessagesSearch: string[];
};

export const useMessagesListSearchScreen = (user_uid: string): UseMessagesListSearchScreenReturn => {
  const searchMessagesStore = useSearchMessagesStore((s) => s.searchMessages);
  const setSearchMessagesStore = useSearchMessagesStore((s) => s.setSearchMessages);
  const clearSearchMessagesStore = useSearchMessagesStore((s) => s.clearSearchMessages);
  const debouncedSearch = useDebouncedValue(searchMessagesStore, 300).trim().toLowerCase();
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMessagesListQuery(user_uid, {
    search: debouncedSearch,
  });
  const messagesList = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);
  const uidMessagesSearch = useMemo(() => messagesList.flatMap((m) => m.uid) ?? [], [messagesList]);

  return {
    searchMessagesStore,
    setSearchMessagesStore,
    clearSearchMessagesStore,
    messagesListSearch: messagesList,
    statusSearch: status,
    fetchNextPageSearch: fetchNextPage,
    hasNextPageSearch: hasNextPage,
    isFetchingNextPageSearch: isFetchingNextPage,
    isLoadingSearch: isLoading,
    uidMessagesSearch,
  };
};
