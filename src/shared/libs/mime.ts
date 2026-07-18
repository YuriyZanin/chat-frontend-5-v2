export const kindFromMime = (mime: string): string => {
  if (mime.startsWith('image/')) return 'фото';
  if (mime.startsWith('video/')) return 'видео';
  if (mime.startsWith('audio/')) return 'аудио';
  return 'файл';
};
