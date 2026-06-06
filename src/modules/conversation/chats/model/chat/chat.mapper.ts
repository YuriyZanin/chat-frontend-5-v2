import { AttachmentKind, Chat, FilesSummaryEntity } from 'modules/conversation/chats/entity';
import { ChatApi } from './chat.api.schema';

const isAttachmentKind = (value: string): value is AttachmentKind => {
  return value === 'image' || value === 'video' || value === 'audio' || value === 'file';
};

const mapFilesSummaryFromApi = (api?: { types: string[]; count: number }): FilesSummaryEntity => {
  if (!api) {
    return { types: [], count: 0 };
  }

  return {
    types: api.types.filter(isAttachmentKind),
    count: api.count,
  };
};

export const mapChatFromApi = (api: ChatApi): Chat => {
  return {
    peer: {
      uid: api.chat.uid,

      username: api.chat.username,
      nickname: api.chat.nickname,
      firstName: api.chat.first_name,
      lastName: api.chat.last_name,

      avatarUrl: api.chat.avatar_master_url || api.chat.avatar_webp_url,
      avatarWebpUrl: api.chat.avatar_master_url || api.chat.avatar_webp_url,

      isBlocked: api.chat.is_blocked,
      isOnline: api.chat.is_online,
      isInContacts: api.chat.is_in_contacts,

      wasOnlineAt: api.chat.was_online_at,
    },

    chat: {
      id: api.id,
      chatKey: api.chat_key,
      chatType: api.chat_type,
      name: api.name,
      is_favorite: api.is_favorite,
      notifications: api.notifications,
      newMessageCount: api.new_message_count,
      lastActivityAt: api.last_activity_at,
    },

    messages: {
      lastSeenMessage: api.last_seen_message
        ? {
            id: api.last_seen_message.id,
            uid: api.last_seen_message.uid,
          }
        : undefined,

      firstNewMessage: api.first_new_message
        ? {
            id: api.first_new_message.id,
            uid: api.first_new_message.uid,
          }
        : undefined,

      lastMessage: api.last_message
        ? {
            id: api.last_message.id,
            uid: api.last_message.uid,
            fromUser: api.last_message.from_user,
            content: api.last_message.content,

            filesSummary: mapFilesSummaryFromApi(api.last_message.files_summary),

            hasRepliedMessage: api.last_message.has_replied_message,
            hasForwardedMessage: api.last_message.has_forwarded_message,
            new: api.last_message.new,
            createdAt: api.last_message.created_at,
            updatedAt: api.last_message.updated_at,
          }
        : undefined,
    },
  };
};
