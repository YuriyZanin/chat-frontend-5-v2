import { apiFetch } from 'shared/api/fetcher';

export type SupportMessagePayload = {
  email: string;
  text: string;
};

export type SupportMessageResponse = {
  email: string;
  text: string;
  message: string;
};

export type SupportMessageError = { detail: string } | { message: string } | { field_name: string[] };

export const sendSupportMessage = (
  payload: SupportMessagePayload,
): Promise<SupportMessageResponse | SupportMessageError> => {
  const url = new URL('/api/proxy/api/v1/service/message/', window.location.origin);

  return apiFetch<SupportMessageResponse | SupportMessageError>(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
