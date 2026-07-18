import { UserForAdd } from '../entity/info.entity';
import { UserForAddApi } from '../model/info.api.schema';

export const mapUserForAddFromApi = (api: UserForAddApi): UserForAdd => {
  const {
    uid,
    is_deleted,
    avatar_url,
    avatar_webp_url,
    avatar_small_url,
    avatar_master_url,
    is_online,
    was_online_at,
    first_name,
    last_name,
  } = api;

  return {
    uid,
    isDeleted: is_deleted,
    avatarUrl: avatar_url,
    avatarWebpUrl: avatar_webp_url,
    avatarSmallUrl: avatar_small_url,
    avatarMasterUrl: avatar_master_url,
    isOnline: is_online,
    wasOnlineAt: was_online_at ?? undefined,
    firstName: first_name,
    lastName: last_name,
  };
};
