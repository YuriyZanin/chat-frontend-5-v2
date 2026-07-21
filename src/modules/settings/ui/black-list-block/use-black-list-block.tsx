import { useDebouncedValue } from 'modules/conversation/shared/hooks';
import { useSearchStore } from 'modules/settings/model/search';
import { BlacklistedUser } from 'shared/api/blacklist.api';
import { useGetBlacklist } from 'shared/query/blacklist.query';

type UseBlackListBlockReturn = {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
  contacts?: BlacklistedUser[];
  isLoading: boolean;
  error: unknown;
};

export const useBlackListBlock = (): UseBlackListBlockReturn => {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clearQuery = useSearchStore((s) => s.clearQuery);

  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: blacklistUsers, isLoading, error } = useGetBlacklist();

  const normalizedQuery = query.trim().toLowerCase();
  const filteredUsers = normalizedQuery
    ? blacklistUsers?.filter((u) => `${u.first_name} ${u.last_name}`.toLowerCase().includes(normalizedQuery))
    : blacklistUsers;

  return { query, setQuery, clearQuery, contacts: filteredUsers, isLoading, error };
};
