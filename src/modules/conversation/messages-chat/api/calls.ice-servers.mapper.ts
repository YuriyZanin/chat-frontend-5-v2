import { CallConfig, IceServer } from '../entity/calls.entity';
import { IceServersApiResponse } from '../model/calls/calls.api.schema';

export const mapCallConfigFromApi = (api: IceServersApiResponse): CallConfig => {
  const { ice_servers } = api;

  const iceServers: IceServer[] = ice_servers.map((s) => {
    return {
      urls: s.urls,
      username: s.username,
      credential: s.credential,
    };
  });

  return {
    iceServers,
  };
};
