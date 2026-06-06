import { apiFetch } from 'shared/api';

export const avatarUploadApi = (file: File): Promise<{ uid: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<{ uid: string }>(`/api/proxy/api/v1/media/upload/group-avatar/`, {
    method: 'POST',
    body: formData,
  });
};
