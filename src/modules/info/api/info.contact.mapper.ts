import { ProfileInfo } from '../entity/info.entity';
import { InfoProfileApi } from '../model/info.api.schema';

export const mapInfoProfileFromApi = (api: InfoProfileApi): ProfileInfo => {
  const {
    uid,
    is_deleted,
    username,
    nickname,
    first_name,
    last_name,
    avatar_webp_url,
    avatar_small_url,
    avatar_master_url,
    is_filled,
    additional_information,
    birthday,
    is_online,
    was_online_at,
    is_blocked,
    chat_id,
  } = api;

  return {
    uid,
    isDeleted: is_deleted,
    username: username || '',
    nickname: nickname || '',
    firstName: first_name || '',
    lastName: last_name || '',
    avatar: avatar_master_url || avatar_webp_url || avatar_small_url || '',
    avatarUrl: avatar_master_url || avatar_webp_url || avatar_small_url || '',
    avatarWebp: avatar_master_url || avatar_webp_url || avatar_small_url || '',
    avatarWebpUrl: avatar_master_url || avatar_webp_url || avatar_small_url || '',
    isFilled: is_filled,
    additionalInformation: additional_information || '',
    birthday: birthday || 0,
    isOnline: is_online,
    wasOnlineAt: was_online_at || 0,
    isBlocked: is_blocked,
    chatId: chat_id,
  };
};
