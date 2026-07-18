import { useDebouncedValue } from 'modules/conversation/shared/hooks';
import { useMemo } from 'react';
import { mapParticipantFromApi } from '../api/info.participant.mapper';
import { useParticipantsQuery } from '../api/info.query';
import { Participant } from '../entity/info.entity';
import { useInfoSearchStore } from '../model/info.search.store';

type UseParticipantsScreenReturn = {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
  participants: Participant[] | undefined;
  filtered: Participant[] | undefined;
};

export const useParticipantsScreen = (chatKey: string): UseParticipantsScreenReturn => {
  const query = useInfoSearchStore((s) => s.query);
  const setQuery = useInfoSearchStore((s) => s.setQuery);
  const clearQuery = useInfoSearchStore((s) => s.clearQuery);

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: globals } = useParticipantsQuery(debouncedQuery, chatKey);

  const participants = useMemo(
    () => globals?.pages.flatMap((page) => page.results.map(mapParticipantFromApi)) ?? [],
    [globals],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? participants?.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(normalizedQuery))
    : participants;

  return {
    query,
    setQuery,
    clearQuery,
    participants,
    filtered,
  };
};
