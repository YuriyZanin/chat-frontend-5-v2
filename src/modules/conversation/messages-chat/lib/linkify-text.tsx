import React from 'react';

export function LinkifyText(text: string): React.ReactNode[] {
  // URL: http(s)://... или домен.tld/... или домен:80...
  // + аккуратно обрезаем запятые/точки в конце
  const urlRegex = /((https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s<]*)?)/gi;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  const matches = text.matchAll(urlRegex);
  for (const match of matches) {
    const rawUrl = match[0];
    const index = match.index ?? 0;

    // Добавляем текст до URL
    if (index > lastIndex) {
      result.push(text.slice(lastIndex, index));
    }

    // Убираем типичные завершающие знаки, которые часто "прилипают" к ссылке
    const cleaned = rawUrl.replace(/[),.;:!?]+$/g, '');

    // Если очистили — добавим обратно хвост как обычный текст
    const tail = rawUrl.slice(cleaned.length);

    const href = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`;

    result.push(
      <a
        key={`${index}-${cleaned}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{ color: '#1e88e5', textDecoration: 'underline', cursor: 'pointer' }}
        onClick={(e) => {
          // если хочешь — можно запретить системные действия и управлять вручную
          // e.preventDefault();
        }}
      >
        {cleaned}
      </a>,
    );

    if (tail) result.push(tail);

    lastIndex = index + rawUrl.length;
  }

  // остаток текста
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
