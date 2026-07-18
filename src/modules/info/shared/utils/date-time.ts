export function formatTimestamp(seconds: number | undefined): string {
  if (!seconds) return '';

  const date = new Date(seconds * 1000);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}
