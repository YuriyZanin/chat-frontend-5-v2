'use client';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useRef, useState } from 'react';
import type { RestMessageFileApi } from '../model/messages-list/user-messages.api.schema';
import { useToastVisibleStore } from '../zustand-store/zustand-store';

type UseDownloadMessageFileReturn = {
  handleDownloadMessageFileClick: () => Promise<void>;
  handleStopDownloadMessageFileClick: () => void;
  isDownloading: boolean;
};

export const useDownloadMessageFile = (files: RestMessageFileApi[]): UseDownloadMessageFileReturn => {
  const downloadControllerRef = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  //управлят состояние показать карточку, что сообщение скопировано, либо нет
  const setToastVisibleStore = useToastVisibleStore((s) => s.setToastVisible);
  const handleDownloadMessageFileClick = async (): Promise<void> => {
    // Если уже идёт загрузка — отменяем предыдущую
    if (downloadControllerRef.current) {
      downloadControllerRef.current.abort();
    }

    const controller = new AbortController();
    downloadControllerRef.current = controller;
    setIsDownloading(true);
    try {
      if (!files.length) throw new Error('Файл не найден');
      for (const file of files) {
        // создаем url для запроса файла через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
        const proxyUrl = `/api/proxy${removeDomain(file.file_protected_url)}`;
        const response = await fetch(proxyUrl, {
          method: 'GET',
          signal: controller.signal,
        });
        const blob = await response.blob();
        const fileToSave = new File([blob], file.download_name, { type: blob.type });
        const isImage = blob.type.startsWith('image/');

        try {
          if (isImage && navigator.canShare && navigator.canShare({ files: [fileToSave] })) {
            await navigator.share({
              files: [fileToSave],
              title: file.download_name,
            });
          } else {
            throw new Error('Share not supported');
          }
        } catch {
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = file.download_name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(objectUrl);
        }
      }
      // показываем карточку в DOM, что файл уже сохранен и через 2 сек. закрываем
      setToastVisibleStore(true);
      setTimeout(() => setToastVisibleStore(false), 2000);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Ошибка скачивания:', error);
      }
    } finally {
      setIsDownloading(false);
      if (downloadControllerRef.current === controller) {
        downloadControllerRef.current = null;
      }
    }
  };

  const handleStopDownloadMessageFileClick = (): void => {
    if (downloadControllerRef.current) {
      downloadControllerRef.current.abort();
      downloadControllerRef.current = null;
      setIsDownloading(false);
    }
  };

  return { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading };
};
