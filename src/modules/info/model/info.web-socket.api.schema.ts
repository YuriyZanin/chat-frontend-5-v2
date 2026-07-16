import { string, z } from 'zod';

const serializerRequestObjectMembersApiSchema = z.object({
  chat_key: z.string().nullable().optional(),
  uid_users_list: z.array(string()),
});

export const serializerRequestApiSchema = z.object({
  action: z.enum(['add_members_to_chat', 'remove_members_from_chat']),
  request_uid: z.string(),
  object: serializerRequestObjectMembersApiSchema,
});

export type AddOrRemoveMembersRequestAPI = z.infer<typeof serializerRequestApiSchema>;

const serializerRequestObjectLeaveGroupApiSchema = z.object({
  chat_key: z.string(),
});

export const serializerRequestLeaveGroupApiSchema = z.object({
  action: z.enum(['leave_chat', 'delete_chat']),
  request_uid: z.string(),
  object: serializerRequestObjectLeaveGroupApiSchema,
});

export type LeaveGroupRequestAPI = z.infer<typeof serializerRequestLeaveGroupApiSchema>;
export type DeleteGroupRequestAPI = z.infer<typeof serializerRequestLeaveGroupApiSchema>;

const serializerRequestObjectEditChatApiSchema = z.object({
  chat_key: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  avatar_uid: z.string().optional(),
  chat_type: z.enum(['chat', 'public-group', 'private-group', 'public-channel', 'private-channel']).optional(),
});

export const serializerRequestEditChat = z.object({
  action: z.enum(['edit_chat']),
  request_uid: z.string(),
  object: serializerRequestObjectEditChatApiSchema,
});

export type EditChatRequestAPI = z.infer<typeof serializerRequestEditChat>;

const clearGroupMessagesObjectSerializer = z.object({
  chat_key: z.string(),
  confirm: z.boolean(),
});

export const serializerRequestClearGroupMessages = z.object({
  action: z.enum(['clear_group_messages']),
  request_uid: z.string(),
  object: clearGroupMessagesObjectSerializer,
});

export type ClearGroupRequestAPI = z.infer<typeof serializerRequestClearGroupMessages>;

const serializerRequestObjectTransferOwner = z.object({
  chat_key: z.string(),
  new_owner_uid: z.string(),
});
export const serializerRequestTransferOwnerSchema = z.object({
  action: z.enum(['transfer_owner']),
  request_uid: z.string(),
  object: serializerRequestObjectTransferOwner,
});

export type TransferOwnerRequestAPI = z.infer<typeof serializerRequestTransferOwnerSchema>;
