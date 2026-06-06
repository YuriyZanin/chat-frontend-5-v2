import { z } from 'zod';

export const contactsPaginatedResponseSchema = z.object({
  count: z.number(),
  next: z.string().optional(),
  previous: z.string().optional(),
});

export const systemContactSchema = z.object({
  uid: z.string(),
  is_deleted: z.boolean(),
  avatar_webp_url: z.string(),
  avatar_small_url: z.string(),
  avatar_master_url: z.string(),
  is_online: z.boolean(),
  was_online_at: z.number(),
});

export const userContactApiSchema = z.object({
  uid: z.string(),
  owner_user: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  system_contact: systemContactSchema,
});

export const userContactsResponseSchema = contactsPaginatedResponseSchema.extend({
  results: z.array(userContactApiSchema),
});

export type UserContactApi = z.infer<typeof userContactApiSchema>;
export type UserContactApiResponse = z.infer<typeof userContactsResponseSchema>;
