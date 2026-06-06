import { z } from 'zod';

export const messagesPaginatedResponseSchema = z.object({
  count: z.number(),
  next: z.string().optional(),
  previous: z.string().optional(),
});

export const messagesUserApiSchema = z.object({
  uid: z.string(),
  username: z.string().max(250),
  nickname: z
    .string()
    .min(6)
    .max(32)
    .regex(/^[a-z0-9._]{6,32}$/),
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
  avatar_url: z.string(),
  avatar_webp_url: z.string(),
});

export const restMessageFileApiSchema = z.object({
  id: z.number(),
  uid: z.string(),
  download_name: z.string(),
  media_kind: z.string(),
  file_protected_url: z.string(),
  file_webp_url: z.string(),
  file_small_url: z.string(),
  file_type: z.string().max(128).optional(),
  created_at: z.number(),
  updated_at: z.number(),
});
export type RestMessageFileApi = z.infer<typeof restMessageFileApiSchema>;

export const restFlatMessageApiSchema = z.object({
  id: z.number(),
  uid: z.string(),
  is_deleted: z.boolean(),
  from_user: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  content: z.string().max(4096).optional(),
  files_list: z.array(restMessageFileApiSchema),
});

export const restFlatForwardedMessageApiSchema = restFlatMessageApiSchema.extend({
  avatar_webp_url: z.string(),
});

export const messageRTCApiSchema = z.object({
  uid: z.string(),
  duration: z.number(),
  status: z.string(),
  updated_at: z.number(),
  created_at: z.number(),
});

export const restMessageApiSchema = z.object({
  id: z.number(),
  uid: z.string(),
  from_user: messagesUserApiSchema,
  to_user: messagesUserApiSchema,
  content: z.string().max(4096).optional(),
  replied_messages: z.array(restFlatMessageApiSchema),
  forwarded_messages: z.array(restFlatForwardedMessageApiSchema),
  files_list: z.array(restMessageFileApiSchema),
  new: z.boolean(),
  created_at: z.number(),
  updated_at: z.number(),
  chat_id: z.number(),
  chat_key: z.string(),
  chat_type: z.enum(['chat', 'public-group', 'private-group', 'public-channel', 'private-channel']),
  message_rtc: messageRTCApiSchema.optional(),
});
export type RestMessageApi = z.infer<typeof restMessageApiSchema>;

export const messagesListResponseSchema = messagesPaginatedResponseSchema.extend({
  results: z.array(restMessageApiSchema),
});

export type MessagesListApiResponse = z.infer<typeof messagesListResponseSchema>;

export const messagesListQuerySchema = z.object({
  from_me: z.boolean().optional(),
  new: z.boolean().optional(),
  ordering: z.string().trim().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  range_time_end_created: z.number().optional(),
  range_time_end_updated: z.number().optional(),
  range_time_start_created: z.number().optional(),
  range_time_start_updated: z.number().optional(),
  search: z.string().trim().optional(),
});
export type MessagesListQuery = z.infer<typeof messagesListQuerySchema>;

export const ChatAttachmentUploadResultSchema = z.object({
  uid: z.string(),
  download_name: z.string().max(255).optional(),
  media_kind: z.enum(['image', 'file', 'voice']).optional(),
  upload_status: z.enum(['draft', 'attached', 'expired', 'deleted']).optional(),
});
export const ChatAttachmentUploadResponseSchema = z.object({
  results: z.array(ChatAttachmentUploadResultSchema),
});
export type ChatAttachmentUploadResponseApi = z.infer<typeof ChatAttachmentUploadResponseSchema>;

export const VoiceAttachmentUploadResponseSchema = z.object({
  uid: z.string(),
  download_name: z.string().max(255).optional(),
  media_kind: z.enum(['image', 'file', 'voice']).optional(),
  upload_status: z.enum(['draft', 'attached', 'expired', 'deleted']).optional(),
  duration_seconds: z.number().min(0).max(2147483647).optional(),
});
export type VoiceAttachmentUploadResponseApi = z.infer<typeof VoiceAttachmentUploadResponseSchema>;
