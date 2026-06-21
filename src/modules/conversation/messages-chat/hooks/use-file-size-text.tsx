'use client';
import { useEffect, useState } from 'react';
import { formatBytesFileText } from '../utils/format-bytes-file-text';

type useFileSizeTextReturn = {
  fileSizeText: string;
};

export const useFileSizeText = ({ url }: { url: string | null }): useFileSizeTextReturn => {
  //состояние c текстом где указан размер файла
  const [fileSizeText, setFileSizeText] = useState<string>('—');
  // эффект для асинхронного получения размера файла по url
  useEffect(() => {
    let cancelled = false;
    const loadSize = async (): Promise<void> => {
      if (!url) {
        setFileSizeText('—');
        return;
      }
      try {
        const size = await formatBytesFileText(url);
        if (!cancelled) setFileSizeText(size);
      } catch (e) {
        if (!cancelled) setFileSizeText('—');
      }
    };
    loadSize();
    return (): void => {
      cancelled = true;
    };
  }, [url]);
  return { fileSizeText };
};
