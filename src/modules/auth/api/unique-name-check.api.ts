import { apiFetch } from 'shared/api/fetcher';

export type CheckUniqueNameResponse =
  | { messages: string }
  | { field_name: string[] }
  | { detail: string }
  | { message: string };

export const checkUniqueName = (nickname: string): Promise<CheckUniqueNameResponse> => {
  const url = new URL(
    `/api/proxy/api/v1/auth/messenger/profile/unique_nickname_check/${encodeURIComponent(nickname)}/`,
    window.location.origin,
  );
  return apiFetch<CheckUniqueNameResponse>(url.toString(), {
    method: 'GET',
  });
};
