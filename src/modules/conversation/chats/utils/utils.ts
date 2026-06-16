import type { Msg } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import type { Chat } from '../entity';

export const translateMessageIntoChat = (msg: Msg): Chat => {
  return {
    peer: {
      uid: msg.from_user.uid,
      username: msg.from_user.username,
      nickname: msg.from_user.nickname,
      firstName: msg.from_user.first_name ?? '',
      lastName: msg.from_user.last_name ?? '',
      avatarUrl: msg.from_user.avatar_master_url || msg.from_user.avatar_webp_url,
      avatarWebpUrl: msg.from_user.avatar_master_url || msg.from_user.avatar_webp_url,
      isBlocked: false,
      isOnline: true,
      isInContacts: false,
      wasOnlineAt: Date.now() / 1000,
    },
    chat: {
      id: msg.chat_id,
      chatKey: msg.chat_key,
      chatType: msg.chat_type,
      name: '',
      is_favorite: false,
      notifications: false,
      newMessageCount: 1,
      lastActivityAt: Date.now() / 1000,
    },
    messages: {
      lastSeenMessage: undefined,
      firstNewMessage: undefined,
      lastMessage: {
        content: msg.content ?? '',
        createdAt: msg.created_at,
        filesSummary: { types: Array(0), count: 0 },
        fromUser: msg.from_user.uid,
        hasForwardedMessage: false,
        hasRepliedMessage: false,
        id: 0,
        new: false,
        uid: msg.uid,
        updatedAt: 0,
      },
    },
  };
};

//функция которая из url убирает домен
export const removeDomain = (fullUrl: string): string => {
  if (!fullUrl) return '';
  const url = new URL(fullUrl);
  return url.pathname + url.search + url.hash;
};
