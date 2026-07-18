import { apiFetch } from 'shared/api';
import { IceServersApiResponse } from '../model/calls/calls.api.schema';

export const getIceServers = (
  ordering?: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<IceServersApiResponse> => {
  const searchParams = new URLSearchParams();

  if (ordering) searchParams.set('ordering', ordering);

  return apiFetch<IceServersApiResponse>(`/api/proxy/api/v1/chat/calls/ice-servers/?${searchParams.toString()}`, {
    method: 'GET',
    signal,
  });
};
