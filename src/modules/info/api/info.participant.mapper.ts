import { Participant } from '../entity/info.entity';
import { ParticipantApi } from '../model/info.api.schema';

export const mapParticipantFromApi = (api: ParticipantApi): Participant => {
  const {
    uid,
    is_deleted,
    first_name,
    last_name,
    avatar_webp_url,
    avatar_small_url,
    avatar_master_url,
    is_owner,
    is_blocked,
    is_online,
    was_online_at,
    is_in_contacts,
  } = api;

  return {
    uid,
    isDeleted: is_deleted,
    firstName: first_name,
    lastName: last_name,
    avatarUrl: avatar_master_url || avatar_webp_url || avatar_small_url || '',
    avatarWebpUrl: avatar_webp_url,
    avatarSmallUrl: avatar_small_url,
    avatarMasterUrl: avatar_master_url,
    isOwner: is_owner,
    isBlocked: is_blocked,
    isOnline: is_online,
    wasOnlineAt: was_online_at ?? undefined,
    isInContacts: is_in_contacts,
  };
};
