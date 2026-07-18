import { Contact } from 'modules/conversation/contacts/entity';
import { ContactApi } from './contact.types';
import { ContactSchemaApi } from './search-contact.api.schema';

export const mapContactFromApi = (api: ContactApi): Contact => {
  const { uid, first_name, last_name } = api;
  const fullName = `${first_name} ${last_name}`;
  const nickname = 'nickname' in api ? api.nickname : '';

  if ('system_contact' in api) {
    const { uid, avatar_webp_url, avatar_master_url, is_online, was_online_at } = api.system_contact;
    return {
      uid,
      firstName: first_name,
      lastName: last_name,
      fullName,
      nickname,
      avatarUrl: avatar_master_url || avatar_webp_url || '',
      isOnline: is_online,
      wasOnlineAt: was_online_at,
    };
  }

  const { chat_id, avatar_url, is_online, was_online_at } = api;
  return {
    uid,
    nickname,
    firstName: first_name,
    lastName: last_name,
    chatId: chat_id,
    fullName,
    avatarUrl: avatar_url,
    isOnline: is_online,
    wasOnlineAt: was_online_at,
  };
};

export const mapSearchingContactFromApi = (api: ContactSchemaApi): Contact => {
  const {
    uid,
    username,
    nickname,
    first_name,
    last_name,
    phone,
    avatar_webp_url,
    avatar_small_url,
    is_online,
    was_online_at,
  } = api;
  const fullName = `${first_name} ${last_name}`;

  return {
    uid,
    nickname,
    firstName: first_name,
    lastName: last_name,
    fullName,
    avatarUrl: avatar_webp_url || avatar_small_url,
    isOnline: is_online,
    wasOnlineAt: was_online_at,
  };
};
