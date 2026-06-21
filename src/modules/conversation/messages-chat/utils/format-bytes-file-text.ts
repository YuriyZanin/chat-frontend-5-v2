export const formatBytesFileText = async (url: string | null): Promise<string> => {
  if (!url) return '—';

  const urlObj = new URL(url);
  const pathAfterFirstSlash = urlObj.pathname;
  const proxyUrl = `/api/proxy${pathAfterFirstSlash}`;

  const response = await fetch(proxyUrl, { method: 'GET' });
  const blob = await response.blob();
  const bytes = blob.size;

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
