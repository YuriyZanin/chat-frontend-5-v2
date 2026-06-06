import { ChatType, GroupInfo } from '../entity/info.entity';
import { GroupOrChanelApiResponse, MessageApiResponse } from '../model/info.api.schema';

export const mapInfoGroupFromApi = (api: GroupOrChanelApiResponse): GroupInfo => {
  const {
    id,
    is_active,
    is_favorite,
    notifications,
    message_count,
    new_message_count,
    name,
    chat_type,
    chat_key,
    created_by,
    description,
  } = api;

  const { content, from_user, created_at } = (api.last_message as MessageApiResponse) ?? {};

  const participants = api.participants.map((p) => ({
    uid: p.uid,
    fullName: p.full_name,
  }));

  return {
    id,
    isActive: is_active,
    isFavorite: is_favorite,
    notifications,
    messageCount: message_count,
    newMessageCount: new_message_count,
    name: name,
    chatKey: chat_key,
    chatType: chat_type as ChatType,
    createdBy: created_by,
    description: description ?? '',
    uid: api.chat.uid,
    avatar: api.chat.avatar_master_url || api.chat.avatar_webp_url || '',
    lastMessage: { content, fromUser: from_user, createdAt: created_at },
    participants,
  };
};
