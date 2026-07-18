import { apiFetch } from 'shared/api';

export const deleteContact = async (uid: string): Promise<void> => {
  await apiFetch<void>(`/api/proxy/api/v1/contact/messenger-delete-contact/${uid}/`, { method: 'DELETE' });
};
