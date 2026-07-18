import { apiFetch } from 'shared/api';
import type { VoiceAttachmentUploadResponseApi } from '../model/messages-list/user-messages.api.schema';

export const voiceUploadApi = (file: File): Promise<VoiceAttachmentUploadResponseApi> => {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<VoiceAttachmentUploadResponseApi>(`/api/proxy/api/v1/chat/attachments/upload/voice/`, {
    method: 'POST',
    body: formData,
  });
};
