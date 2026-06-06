import { string, z } from 'zod';
//RequestCreatingMessageApi
const serializerFileMessageApiSchema = z.object({
  filename: z.string().default('document.pdf'),
  data: z.string().default('UERGLTEuNCBmaWxlIGNvbnRlbnQ='),
});

export type FileMessageApi = z.infer<typeof serializerFileMessageApiSchema>;

const serializerRequestObjectCreateMessageApiSchema = z.object({
  to_user_uid: z.string().nullable().optional(),
  chat_key: z.string().nullable().optional(),
  content: z.string().trim(),
  status: z.enum(['publish', 'draft']),
  message_attachment_uids: z.array(string()).nullable().optional(),
  replied_messages: z.array(string()).nullable().optional(),
  forwarded_messages: z.array(string()).nullable().optional(),
});
export const serializerRequestCreatingMessageApiSchema = z.object({
  action: z.enum(['create_text_message']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectCreateMessageApiSchema,
});

export type CreateTextMessageAPI = z.infer<typeof serializerRequestCreatingMessageApiSchema>;

//RequestChangeStatusReadMessageApi
const serializerRequestObjectChangeStatusReadMessageApiSchema = z.object({
  uid: z.string(),
  reader_uid: z.string().nullable().optional(),
  new_read_status: z.boolean().optional(),
  chat_key: z.string().optional(),
});

export const serializerRequestChangeStatusReadMessageApiSchema = z.object({
  action: z.enum(['change_status_read_message']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectChangeStatusReadMessageApiSchema,
});
export type ChangeStatusReadMessageAPI = z.infer<typeof serializerRequestChangeStatusReadMessageApiSchema>;

//RequestDeleteMessageApi
const serializerRequestObjectDeleteMessageApiSchema = z.object({
  uid: z.string(),
  for_all: z.boolean().optional(),
  chat_key: z.string().optional(),
});
export const serializerRequestDeleteMessageApiSchema = z.object({
  action: z.enum(['delete_message']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectDeleteMessageApiSchema,
});
export type DeleteMessageApi = z.infer<typeof serializerRequestDeleteMessageApiSchema>;
