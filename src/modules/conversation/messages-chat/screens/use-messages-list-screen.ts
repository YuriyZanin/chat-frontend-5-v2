'use client';

import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { useDebouncedValue } from 'modules/conversation/shared/hooks';
import { useMemo } from 'react';
import { useMessagesListQuery } from '../api/messages-list.query';
import type { RestMessageApi } from '../model/messages-list';
import { MessagesListApiResponse } from '../model/messages-list';
import { useMessagesListStore } from '../model/messages-list-search';

type UseMessagesListScreenReturn = {
  from_me: boolean;
  setFromMe: (q: boolean) => void;
  new: boolean;
  setNew: (q: boolean) => void;
  ordering: string;
  setOrdering: (q: string) => void;
  clearOrdering: () => void;
  range_time_end_created: number;
  setRangeTimeEndCreated: (q: number) => void;
  range_time_end_updated: number;
  setRangeTimeEndUpdated: (q: number) => void;
  range_time_start_created: number;
  setRangeTimeStartCreated: (q: number) => void;
  range_time_start_updated: number;
  setRangeTimeStartUpdated: (q: number) => void;
  search: string;
  setSearch: (q: string) => void;
  clearSearch: () => void;
  messagesList: RestMessageApi[];
  status: string;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<MessagesListApiResponse>, unknown>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const useMessagesListScreen = (user_uid: string): UseMessagesListScreenReturn => {
  const from_me = useMessagesListStore((s) => s.from_me);
  const setFromMe = useMessagesListStore((s) => s.setFromMe);
  const newS = useMessagesListStore((s) => s.new);
  const setNew = useMessagesListStore((s) => s.setNew);
  const ordering = useMessagesListStore((s) => s.ordering);
  const setOrdering = useMessagesListStore((s) => s.setOrdering);
  const clearOrdering = useMessagesListStore((s) => s.clearOrdering);
  const range_time_end_created = useMessagesListStore((s) => s.range_time_end_created);
  const setRangeTimeEndCreated = useMessagesListStore((s) => s.setRangeTimeEndCreated);
  const range_time_end_updated = useMessagesListStore((s) => s.range_time_end_updated);
  const setRangeTimeEndUpdated = useMessagesListStore((s) => s.setRangeTimeEndUpdated);
  const range_time_start_created = useMessagesListStore((s) => s.range_time_start_created);
  const setRangeTimeStartCreated = useMessagesListStore((s) => s.setRangeTimeStartCreated);
  const range_time_start_updated = useMessagesListStore((s) => s.range_time_start_updated);
  const setRangeTimeStartUpdated = useMessagesListStore((s) => s.setRangeTimeStartUpdated);
  const search = useMessagesListStore((s) => s.search);
  const setSearch = useMessagesListStore((s) => s.setSearch);
  const clearSearch = useMessagesListStore((s) => s.clearSearch);

  const debouncedSearch = useDebouncedValue(search, 300).trim().toLowerCase();
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessagesListQuery(user_uid, {
    from_me,
    new: newS,
    ordering,
    range_time_end_created,
    range_time_end_updated,
    range_time_start_created,
    range_time_start_updated,
    search: debouncedSearch,
  });
  const messagesList = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);

  return {
    from_me,
    setFromMe,
    new: newS,
    setNew,
    ordering,
    setOrdering,
    clearOrdering,
    range_time_end_created,
    setRangeTimeEndCreated,
    range_time_end_updated,
    setRangeTimeEndUpdated,
    range_time_start_created,
    setRangeTimeStartCreated,
    range_time_start_updated,
    setRangeTimeStartUpdated,
    search,
    setSearch,
    clearSearch,
    messagesList: messagesList,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
