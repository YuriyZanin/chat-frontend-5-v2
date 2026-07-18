import { z } from 'zod';

const serializerRequestObjectAnswer = z.object({
  from_user_uid: z.string(),
  to_user_uid: z.string(),
  message_rtc_uid: z.string(),
  answer_sdp: z.string(),
});

export const serializerAnswerRequestApiSchema = z.object({
  action: z.enum(['answer_call']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectAnswer,
});

export type AnswerCallRequestAPI = z.infer<typeof serializerAnswerRequestApiSchema>;

const serializerRequestObjectCallComplete = z.object({
  from_user_uid: z.string(),
  to_user_uid: z.string(),
  type_complete: z.enum(['unreceived', 'rejected', 'completed']),
  message_rtc_uid: z.string(),
  duration: z.number().nullable(),
});

export const serializerCallCompleteRequestApiSchema = z.object({
  action: z.enum(['call_completion']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectCallComplete,
});

export type CallCompleteRequestAPI = z.infer<typeof serializerCallCompleteRequestApiSchema>;

const serializerRequestObjectCallState = z.object({
  from_user_uid: z.string(),
  to_user_uid: z.string(),
  message_rtc_uid: z.string(),
  state: z.enum(['connected', 'failed']),
  reason_code: z
    .enum([
      'connection_timeout',
      'ice_failed',
      'peer_connection_failed',
      'local_media_error',
      'signaling_error',
      'unknown_error',
    ])
    .nullable(),
});

export const serializerCallStateRequestApiSchema = z.object({
  action: z.enum(['call_state_update']),
  request_uid: z.string().optional(),
  object: serializerRequestObjectCallState,
});

export type CallStateRequestAPI = z.infer<typeof serializerCallStateRequestApiSchema>;

const SerializerRequestObjectICECandidate = z.object({
  from_user_uid: z.string(),
  to_user_uid: z.string(),
  message_rtc_uid: z.string(),
  ice_candidate: z.string(),
});

export const serializerIceCandidateRequestApiSchema = z.object({
  action: z.enum(['ice_candidate']),
  request_uid: z.string().optional(),
  object: SerializerRequestObjectICECandidate,
});

export type IceCandidateRequestAPI = z.infer<typeof serializerIceCandidateRequestApiSchema>;

const SerializerRequestObjectCallOffer = z.object({
  to_user_uid: z.string(),
  offer_sdp: z.string(),
});

export const serializerCallOfferRequestApiSchema = z.object({
  action: z.enum(['offer_call']),
  request_uid: z.string().optional(),
  object: SerializerRequestObjectCallOffer,
});

export type OfferCallRequestAPI = z.infer<typeof serializerCallOfferRequestApiSchema>;
