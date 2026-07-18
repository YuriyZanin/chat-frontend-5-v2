import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CallConfig } from '../entity/calls.entity';
import { getIceServers } from './calls.api';
import { mapCallConfigFromApi } from './calls.ice-servers.mapper';

export const useIceServersQuery = (ordering?: string): UseQueryResult<CallConfig> => {
  return useQuery({
    queryKey: ['calls', 'ice-servers', ordering],

    queryFn: async ({ signal }) => {
      return await getIceServers(ordering, { signal });
    },

    select: (data) => mapCallConfigFromApi(data),

    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};
