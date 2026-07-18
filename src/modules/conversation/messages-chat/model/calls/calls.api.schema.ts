import { z } from 'zod';

const IceServerApiSchema = z.object({
  urls: z.array(z.string()),
  username: z.string().optional(),
  credential: z.string().optional(),
});

export const IceServersApiSchema = z.object({
  ice_servers: z.array(IceServerApiSchema),
});

export type IceServersApiResponse = z.infer<typeof IceServersApiSchema>;
