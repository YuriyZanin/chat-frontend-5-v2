import { useDebouncedValue } from 'modules/conversation/shared/hooks';
import { useUserForAddQuery } from 'modules/info/api/info.query';
import { mapUserForAddFromApi } from 'modules/info/api/info.userForAdd.mapper';
import { UserForAdd } from 'modules/info/entity/info.entity';
import { useInfoSearchStore } from 'modules/info/model/info.search.store';
import { useMemo } from 'react';

type UseAddMemberPanelReturn = {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
  users: UserForAdd[] | undefined;
};

export const useAddMemberPanel = (chatKey: string): UseAddMemberPanelReturn => {
  const query = useInfoSearchStore((s) => s.query);
  const setQuery = useInfoSearchStore((s) => s.setQuery);
  const clearQuery = useInfoSearchStore((s) => s.clearQuery);

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: globals } = useUserForAddQuery(debouncedQuery, chatKey);

  const users = useMemo(
    () => globals?.pages.flatMap((page) => page.results.map(mapUserForAddFromApi)) ?? [],
    [globals],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? users?.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(normalizedQuery))
    : users;

  return {
    query,
    setQuery,
    clearQuery,
    users: filtered,
  };
};
