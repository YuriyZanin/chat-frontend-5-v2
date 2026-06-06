import type { RestMessageApi } from '../model/messages-list';

export const formatBytes = async (
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
): Promise<string> => {
  const cleanUrl = message.files_list.length
    ? message.files_list[0].file_protected_url
    : message.forwarded_messages[0]?.files_list[0].file_protected_url;
  const urlObj = new URL(cleanUrl);
  const pathAfterFirstSlash = urlObj.pathname;
  const proxyUrl = `/api/proxy/${pathAfterFirstSlash}/`;
  const response = await fetch(proxyUrl, {
    method: 'GET',
  });
  const blob = await response.blob();
  const bytes = blob.size;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};
