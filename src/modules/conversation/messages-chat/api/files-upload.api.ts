import { apiFetch } from 'shared/api';
import type { ChatAttachmentUploadResponseApi } from '../model/messages-list/user-messages.api.schema';

export const filesUploadApi = (file: File): Promise<ChatAttachmentUploadResponseApi> => {
  const formData = new FormData();
  formData.append('files', file);
  return apiFetch<ChatAttachmentUploadResponseApi>(`/api/proxy/api/v1/chat/attachments/upload/`, {
    method: 'POST',
    body: formData,
  });
};
