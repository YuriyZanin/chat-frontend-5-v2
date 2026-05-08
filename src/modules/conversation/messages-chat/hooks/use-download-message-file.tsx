'use client';
import { useRef, useState } from 'react';
import type { RestMessageApi } from '../model/messages-list';
import { useToastVisibleStore } from '../zustand-store/zustand-store';

type UseDownloadMessageFileReturn = {
  handleDownloadMessageFileClick: () => Promise<void>;
  handleStopDownloadMessageFileClick: () => void;
  isDownloading: boolean;
};

export const useDownloadMessageFile = (
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
): UseDownloadMessageFileReturn => {
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
      // Получаем объект файла
      const files = message.files_list.length ? message.files_list : message.forwarded_messages[0]?.files_list;
      if (!files.length) throw new Error('Файл не найден');
      files.forEach(async (file) => {
        // Очищаем URL от лишнего слеша
        const cleanUrl = file.file_url.replace(/\.(jpe?g|png|gif|webp)\/$/i, '.$1');
        const urlObj = new URL(cleanUrl);
        const pathAfterFirstSlash = urlObj.pathname.slice(1);
        const proxyUrl = `/api/proxy/${pathAfterFirstSlash}/`;
        const response = await fetch(proxyUrl, {
          method: 'GET',
          signal: controller.signal,
        });
        const blob = await response.blob();
        const fileToSave = new File([blob], file.download_name, { type: blob.type });
        const isImage = blob.type.startsWith('image/');
        try {
          // Только изображения шарим
          if (isImage && navigator.canShare && navigator.canShare({ files: [fileToSave] })) {
            // если телефон сохраняем скаченный файл(изображение) в галереи
            await navigator.share({
              files: [fileToSave],
              title: file.download_name,
            });
          } else {
            throw new Error('Share not supported');
          }
        } catch {
          // если браузер то открываем диалог "сохранить как" и сохраняем скаченный файл(изображение)
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = file.download_name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(objectUrl);
        }
      });
      setToastVisibleStore(true);
      setTimeout(() => setToastVisibleStore(false), 2000);
      // показываем карточку в DOM, что файл уже сохранен и через 2 сек. закрываем
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
