import { ContactQuery, UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { NewContact } from 'modules/info/model/info.api.schema';
import { apiFetch } from 'shared/api';
import { ContactApiResponse } from '../model/contact/search-contact.api.schema';

export const getContactsList = (params: ContactQuery): Promise<UserContactApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.ordering) searchParams.set('ordering', params.ordering);

  return apiFetch<UserContactApiResponse>(`/api/proxy/api/v1/contact/messenger-list/?${searchParams.toString()}`, {
    method: 'GET',
  });
};

export const searchUsers = async (
  query: string | string[],
  { signal }: { signal?: AbortSignal } = {},
): Promise<ContactApiResponse> => {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('search', String(query));

  return apiFetch<ContactApiResponse>(`/api/proxy/api/v1/contact/search/?${searchParams.toString()}`, {
    method: 'GET',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const addToContact = async (
  contact: NewContact,
  { signal }: { signal?: AbortSignal } = {},
): Promise<UserContactApiResponse> => {
  return apiFetch<UserContactApiResponse>(`/api/proxy/api/v1/contact/messenger-add-by-phone/`, {
    method: 'POST',
    body: JSON.stringify(contact),
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
