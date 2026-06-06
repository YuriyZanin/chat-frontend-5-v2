import { chatApiSchema } from 'modules/conversation/chats/model/chat.api.schema';
import { z } from 'zod';

export const infoApiSchema = z.object({
  uid: z.string(),
  is_deleted: z.boolean(),
  username: z.string().optional(),
  nickname: z.string().min(5).max(32).optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_webp_url: z.string(),
  avatar_small_url: z.string(),
  avatar_master_url: z.string(),
  is_filled: z.boolean(),
  additional_information: z.string().optional(),
  birthday: z.number().optional(),
  is_online: z.boolean(),
  was_online_at: z.number().nullable(),
  is_blocked: z.boolean().default(false),
  chat_id: z.number(),
});

export type InfoProfileApi = z.infer<typeof infoApiSchema>;
export type InfoProfileApiResponse = z.infer<typeof infoApiSchema>;

export const blockApiSchema = z.object({
  uid: z.string(),
  is_deleted: z.boolean(),
  username: z.string(),
  nickname: z.string(),
  phone: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string(),
  avatar_url: z.string(),
  avatar_webp: z.string(),
  avatar_webp_url: z.string(),
  additional_information: z.string(),
  birthday: z.number(),
  chat_id: z.number(),
  is_online: z.boolean(),
  was_online_at: z.number(),
});

export type BlockProfileApi = z.infer<typeof blockApiSchema>;
export type BlockProfileApiResponse = z.infer<typeof blockApiSchema>;

export type NewContact = {
  user_uid: string;
};

export type ChatPost = {
  is_favorite?: boolean;
  notifications?: boolean;
  index?: number;
  last_seen_message?: number;
};

export type InviteSettingsPost = {
  expires_in: number;
};

export const ChatPostApiSchema = z.object({
  is_favorite: z.boolean(),
  notifications: z.boolean(),
  index: z.number(),
  last_seen_message: z.number(),
  last_seen_message_uid: z.string(),
});

export type ChatPostApiResponse = z.infer<typeof chatApiSchema>;

const chatSchema = z.object({
  uid: z.string(),
  username: z.string().nullable().optional(),
  nickname: z.string().nullable().optional(),
  avatar_webp_url: z.string().nullable(),
  avatar_small_url: z.string().nullable(),
  avatar_master_url: z.string().nullable(),
});

const FileSchema = z.object({
  id: z.number(),
  uid: z.string(),
  download_name: z.string(),
  media_kind: z.string(),
  file_protected_url: z.string().nullable(),
  file_webp_url: z.string().nullable(),
  file_small_url: z.string().nullable(),
  file_type: z.string().max(128).nullable(),
  created_at: z.number(),
  updated_at: z.number(),
});
const RepliedMessagesSchema = z.object({
  id: z.number(),
  uid: z.string(),
  from_user: z.string(),
  content: z.string().max(4096).optional(),
  files_list: z.array(FileSchema),
});

const ForwardedMessagesSchema = z.object({
  id: z.number(),
  uid: z.string(),
  from_user: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar_webp_url: z.string(),
  content: z.string().max(4096).optional(),
  files_list: z.array(FileSchema),
});

const MessageSchema = z.object({
  id: z.number(),
  uid: z.string(),
  from_user: z.string(),
  content: z.string().max(4096),
  files_list: z.array(FileSchema),
  new: z.boolean(),
  replied_messages: z.array(RepliedMessagesSchema),
  forwarded_messages: z.array(ForwardedMessagesSchema),
  created_at: z.number(),
  updated_at: z.number(),
});

const MessageShortSchema = z.object({
  id: z.number(),
  uid: z.string(),
});

const ParticipantSchema = z.object({
  uid: z.string(),
  full_name: z.string(),
});

const GroupOrChanelApiSchema = z.object({
  id: z.number(),
  chat: chatSchema,
  is_active: z.boolean().optional(),
  is_favorite: z.boolean().optional(),
  notifications: z.boolean(),
  index: z.number().min(-2147483648).max(2147483647).optional(),
  message_count: z.number(),
  file_count: z.number(),
  new_message_count: z.number(),
  last_message: MessageSchema.optional(),
  last_seen_message: MessageShortSchema.nullable(),
  first_new_message: MessageShortSchema.nullable(),
  name: z.string(),
  chat_type: z.enum(['private-group', 'public-group', 'private-channel', 'public-channel', 'chat']),
  chat_key: z.string(),
  description: z.string().nullable(),
  created_by: z.string(),
  owner_full_name: z.string(),
  participants: z.array(ParticipantSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GroupOrChanelApiResponse = z.infer<typeof GroupOrChanelApiSchema>;
export type MessageApiResponse = z.infer<typeof MessageSchema>;

const InviteLinkApiSchema = z.object({
  chat_key: z.string(),
  chat_type: z.string(),
  invite_link: z.string(),
  expires_at: z.number(),
});

export type InviteLinkApiResponse = z.infer<typeof InviteLinkApiSchema>;

export const SearchQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  page_size: z.number().int().positive().optional(),
  search: z.string().optional(),
});

export type ParticipantQuery = z.infer<typeof SearchQuerySchema>;
export type UserForAddQuery = z.infer<typeof SearchQuerySchema>;

export const ParticipantApiSchema = z.object({
  uid: z.string(),
  is_deleted: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
  avatar_webp_url: z.string(),
  avatar_small_url: z.string(),
  avatar_master_url: z.string(),
  is_owner: z.boolean(),
  is_blocked: z.boolean(),
  is_online: z.boolean(),
  was_online_at: z.number().nullable(),
  is_in_contacts: z.boolean(),
});

export const PaginatedResponseSchema = z.object({
  count: z.number(),
  next: z.string().optional(),
  previous: z.string().optional(),
});

export const ParticipantResponseSchema = PaginatedResponseSchema.extend({
  results: z.array(ParticipantApiSchema),
});

export type ParticipantApiResponse = z.infer<typeof ParticipantResponseSchema>;
export type ParticipantApi = z.infer<typeof ParticipantApiSchema>;

export const UserForAddApiSchema = z.object({
  uid: z.uuid(),
  is_deleted: z.boolean(),
  avatar_url: z.string(),
  avatar_webp_url: z.string(),
  avatar_small_url: z.string(),
  avatar_master_url: z.string(),
  is_online: z.boolean(),
  was_online_at: z.number().nullable(),
  first_name: z.string(),
  last_name: z.string(),
});

export const UserForAddResponseSchema = PaginatedResponseSchema.extend({
  results: z.array(UserForAddApiSchema),
});

export type UserForAddApiResponse = z.infer<typeof UserForAddResponseSchema>;
export type UserForAddApi = z.infer<typeof UserForAddApiSchema>;

export const GroupAvatarApiSchema = z.object({
  uid: z.uuid(),
});

export type GroupAvatarApiResponse = z.infer<typeof GroupAvatarApiSchema>;

const FromUserFileSchema = z
  .object({
    uid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    avatar_webp_url: z.string(),
    avatar_small_url: z.string(),
  })
  .nullable();
const MessageFileSchema = z
  .object({
    uid: z.string(),
    content: z.string(),
  })
  .nullable();

const ForwardedInFileSchema = z.object({
  uid: z.string(),
});
const GroupChannelFileSchema = z.object({
  id: z.number(),
  uid: z.string(),
  download_name: z.string(),
  media_kind: z.string(),
  file_protected_url: z.string().nullable(),
  file_webp_url: z.string().nullable(),
  file_small_url: z.string().nullable(),
  file_type: z.string().max(128).nullable(),
  size: z.number(),
  updated_at: z.number(),
  created_at: z.number(),
  from_user: FromUserFileSchema,
  is_owner: z.boolean(),
  message: MessageFileSchema,
  forwarded_in: z.array(ForwardedInFileSchema),
});
export const PaginatedGroupChannelFileListShema = PaginatedResponseSchema.extend({
  results: z.array(GroupChannelFileSchema),
});

export type FilesSeachQueryApi = z.infer<typeof SearchQuerySchema>;
export type PaginatedGroupChannelFileListApi = z.infer<typeof PaginatedGroupChannelFileListShema>;
export type ChatFilesListApi = z.infer<typeof GroupChannelFileSchema>;
