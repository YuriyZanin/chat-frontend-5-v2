import React, { JSX } from 'react';
import type { HighlightedMessageProps } from './highlighted-message.props';
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const urlRegex = /((https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s<]*)?)/gi;

type Part = { text: string; isLink: boolean };

function splitIntoParts(text: string): Part[] {
  const parts: Part[] = [];
  let lastIndex = 0;

  const matches = text.matchAll(urlRegex);
  for (const match of matches) {
    const rawUrl = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), isLink: false });
    }

    const cleaned = rawUrl.replace(/[),.;:!?]+$/g, '');
    const tail = rawUrl.slice(cleaned.length); // символы, которые "прилипли" к концу URL

    // Ссылка — cleaned
    parts.push({ text: cleaned, isLink: true });

    // Хвост после URL — обычный текст
    if (tail) parts.push({ text: tail, isLink: false });

    lastIndex = index + rawUrl.length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isLink: false });
  }

  return parts;
}

function highlightText(text: string, search: string, caseSensitive: boolean): React.ReactNode[] {
  if (!search) return [text];

  const flag = caseSensitive ? 'g' : 'gi';
  const escaped = escapeRegExp(search);
  const re = new RegExp(escaped, flag);

  const out: React.ReactNode[] = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      out.push(<span key={`${lastIndex}-${start}`}>{text.slice(lastIndex, start)}</span>);
    }

    out.push(
      <span key={`${start}-${end}`} style={{ color: 'blue' }}>
        {text.slice(start, end)}
      </span>,
    );

    lastIndex = end;

    // защита от бесконечного цикла при пустом совпадении
    if (re.lastIndex === match.index) re.lastIndex++;
  }

  if (lastIndex < text.length) {
    out.push(<span key={`${lastIndex}-${text.length}`}>{text.slice(lastIndex)}</span>);
  }

  return out;
}

export const HighlightedMessage = ({ text, search, caseSensitive = false }: HighlightedMessageProps): JSX.Element => {
  // 1) режем по URL
  const parts = splitIntoParts(text);

  // 2) внутри каждого куска:
  //    - если isLink=true: делаем <a> и внутри него тоже подсвечиваем search (по желанию)
  //    - иначе: просто подсвечиваем search
  return (
    <>
      {parts.map((p, idx) => {
        if (!p.isLink) {
          return <React.Fragment key={idx}>{highlightText(p.text, search, caseSensitive)}</React.Fragment>;
        }

        const cleaned = p.text;
        const href = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`;

        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1e88e5', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {highlightText(cleaned, search, caseSensitive)}
          </a>
        );
      })}
    </>
  );
};
