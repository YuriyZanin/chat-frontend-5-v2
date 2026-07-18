import { JSX, useEffect, useRef, useState } from 'react';
import type { HighlightedFileNameProps, HighlightedTextProps } from './highlighted-file-name.props';

// Функция для обрезки имени файла
const truncateFileName = (fileName: string, maxWidth: number): string => {
  const measure = (text: string): number => {
    const temp = document.createElement('span');
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    temp.style.fontSize = '1.6rem';
    temp.style.fontWeight = '400';
    temp.style.whiteSpace = 'nowrap';
    temp.textContent = text;
    document.body.appendChild(temp);
    const width = temp.offsetWidth;
    document.body.removeChild(temp);
    return width;
  };
  if (measure(fileName) <= maxWidth) {
    return fileName;
  }
  // Разделяем на имя и расширение
  const lastDot = fileName.lastIndexOf('.');
  const name = lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
  const extension = lastDot > 0 ? fileName.substring(lastDot) : '';
  // Обрезаем в центре
  let startLength = Math.floor(name.length / 2);
  let endLength = startLength;
  let truncated = `${name.substring(0, startLength)}...${name.substring(name.length - endLength)}${extension}`;
  while (measure(truncated) > maxWidth && (startLength > 3 || endLength > 3)) {
    if (startLength > 3) startLength--;
    if (endLength > 3) endLength--;
    truncated = `${name.substring(0, startLength)}...${name.substring(name.length - endLength)}${extension}`;
  }
  return truncated;
};

// Функция для экранирования спецсимволов
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Компонент для подсветки текста
const HighlightedText = ({ text, search, caseSensitive = false }: HighlightedTextProps): JSX.Element => {
  if (!search) return <>{text}</>;
  const flag = caseSensitive ? 'g' : 'gi';
  const escaped = escapeRegExp(search);
  const re = new RegExp(escaped, flag);
  const parts: Array<{ text: string; match: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      parts.push({ text: text.slice(lastIndex, start), match: false });
    }
    parts.push({ text: text.slice(start, end), match: true });
    lastIndex = end;
    if (re.lastIndex === match.index) re.lastIndex++;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), match: false });
  }
  return (
    <>
      {parts.map((p, i) =>
        p.match ? (
          <span key={i} style={{ color: 'blue' }}>
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
};

// Объединенный компонент
export const HighlightedFileName = ({
  fileName,
  search,
  maxWidth = 170,
  caseSensitive = false,
}: HighlightedFileNameProps): JSX.Element => {
  const [displayName, setDisplayName] = useState(fileName);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const container = element.parentElement;
    if (!container) return;

    // Обрезаем имя файла
    const truncated = truncateFileName(fileName, maxWidth);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayName(truncated);
  }, [fileName, maxWidth]);

  return (
    <div ref={textRef} title={fileName}>
      <HighlightedText text={displayName} search={search} caseSensitive={caseSensitive} />
    </div>
  );
};
