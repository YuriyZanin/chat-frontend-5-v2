import { z } from 'zod';

const chatSchema = z.object({
  uid: z.string(),
  is_deleted: z.boolean(),
  username: z.string().optional(),
  nickname: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_webp_url: z.string(),
  avatar_small_url: z.string(),
  avatar_master_url: z.string(),
  is_blocked: z.boolean(),
  is_online: z.boolean(),
  was_online_at: z.number().nullable(),
  is_in_contacts: z.boolean(),
});
export type ChatInfo = z.infer<typeof chatSchema>;
export const chatTypeSchema = z.enum(['chat', 'public-group', 'private-group', 'public-channel', 'private-channel']);
export type ChatType = z.infer<typeof chatTypeSchema>;

const messageSchema = z.object({
  id: z.number(),
  uid: z.string(),
});

const lastMessageSchema = messageSchema.extend({
  from_user: z.string(),
  content: z.string(),
  files_summary: z.object({
    types: z.array(z.string()),
    count: z.number(),
  }),
  has_replied_message: z.boolean(),
  has_forwarded_message: z.boolean(),
  new: z.boolean().optional(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const chatListSchema = z.object({
  id: z.number(),
  chat: chatSchema,
  is_favorite: z.boolean().optional(),
  notifications: z.boolean(),
  new_message_count: z.number(),
  name: z.string(),
  chat_type: chatTypeSchema,
  chat_key: z.string(),
  created_by: z.string(),
  last_activity_at: z.number(),
  last_seen_message: messageSchema,
  first_new_message: messageSchema.optional(),
  last_message: lastMessageSchema,
});
export type ChatList = z.infer<typeof chatListSchema>;

export const chatApiSchema = z.object({
  count: z.number(),
  next: z.string().optional(),
  previous: z.string().optional(),
  results: z.array(chatListSchema),
});

export type ChatListApiResponse = z.infer<typeof chatApiSchema>;
export type ChatApi = z.infer<typeof chatListSchema>;

export const chatQuerySchema = z.object({
  is_active: z.boolean().optional(),
  is_blocked: z.boolean().optional(),
  is_favorite: z.boolean().optional(),
  ordering: z.string().trim().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  search: z.string().trim().optional(),
});
export type ChatQuery = z.infer<typeof chatQuerySchema>;
