'use client';

import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { useContactsQuery, useSearchUsersQuery } from 'modules/conversation/contacts/api';
import { Contact } from 'modules/conversation/contacts/entity';
import type { UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { mapContactFromApi } from 'modules/conversation/contacts/model/contact';
import { useSearchStore } from 'modules/conversation/contacts/model/search';
import { useDebouncedValue } from 'modules/conversation/shared/hooks';
import { useMemo } from 'react';

type UseContactsScreenReturn = {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
  contacts: Contact[] | undefined;
  globals: Contact[] | undefined;
  status: string;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<UserContactApiResponse>, unknown>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

export const useContactsScreen = (): UseContactsScreenReturn => {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clearQuery = useSearchStore((s) => s.clearQuery);

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: myContacts, status, isFetchingNextPage, fetchNextPage, hasNextPage } = useContactsQuery();
  const { data: globals } = useSearchUsersQuery(debouncedQuery);

  const contacts = useMemo(
    () => myContacts?.pages.flatMap((page) => page.results.map(mapContactFromApi)) ?? [],
    [myContacts],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredContacts = normalizedQuery
    ? contacts?.filter((c) => c.fullName.toLowerCase().includes(normalizedQuery))
    : contacts;

  return {
    query,
    setQuery,
    clearQuery,
    contacts: filteredContacts,
    globals,
    status,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};
