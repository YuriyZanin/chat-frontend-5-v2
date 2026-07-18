'use client';
import clsx from 'clsx';
import { fileToBase64 } from 'modules/conversation/messages-chat/utils/file-to-base64';
import {
  useAttachmentFilesStore,
  useAttachmentImagesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useRef } from 'react';
import File from '../icons/file.svg';
import Img from '../icons/image.svg';
import styles from './context-menu-attach-file.module.scss';
import type { Attachment, ContextMenuAttachFileProps } from './context-menu-attach-file.props';
const maxSize = 25 * 1024 * 1024; // в байтах, по умолчанию 25MB max размер файла для пересылки

export const ContextMenuAttachFile = ({
  contextMenuPos,
  handleCloseMenu,
  handleAttachmentFilesClick,
  handleAttachmentImagesClick,
}: ContextMenuAttachFileProps): JSX.Element | null => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const setAttachmentFilesStore = useAttachmentFilesStore((s) => s.setAttachmentFiles);
  const setAttachmentImagesStore = useAttachmentImagesStore((s) => s.setAttachmentImages);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `Файл "${file.name}" превышает ${maxSize / 1024 / 1024}MB`;
    }

    if (file.type.startsWith('image/')) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return 'Поддерживаются только JPEG, PNG, GIF и WEBP изображения';
      }
    }
    return null;
  };

  const processFiles = async (files: FileList | null): Promise<void> => {
    if (!files) return;

    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      // Валидация
      const validationError = validateFile(file);
      if (validationError) {
        console.error(validationError);
        continue;
      }
      // Конвертируем в нужный формат
      const fileData = await fileToBase64(file);
      newAttachments.push({
        id: crypto.randomUUID(),
        file: file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileData: fileData,
      });
    }
    setAttachmentFilesStore((prev) => [...prev, ...newAttachments]);
    setAttachmentImagesStore((prev) => [...prev, ...newAttachments]);
  };
  // обработчик который срабатывает при выборе файла(файлов)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    processFiles(e.target.files);
    handleAttachmentFilesClick(); //открываем модальное окно <AlertAttachmentFiles /> и ждем ок;
    e.target.value = ''; // Сброс input
    handleCloseMenu(); // закрываем контекстное меню
  };

  // обработчик который срабатывает при выборе файла(файлов)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    processFiles(e.target.files);
    handleAttachmentImagesClick(); //открываем модальное окно <AlertAttachmentFiles /> и ждем ок;
    e.target.value = ''; // Сброс input
    handleCloseMenu(); // закрываем контекстное меню
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const triggerImageInput = (): void => {
    imageInputRef.current?.click();
  };
  return (
    <div
      className={styles.frame}
      onMouseLeave={handleCloseMenu}
      style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
    >
      <div className={styles.wrapper}>
        <button className={clsx(styles.cell, styles.cellTop)} onClick={triggerImageInput}>
          <div className={styles.text}>Выбрать изображение</div>
          <div className={styles.icon}>
            <Img />
          </div>
        </button>
        <button className={clsx(styles.cell, styles.cellBottom)} onClick={triggerFileInput}>
          <div className={styles.text}>Выбрать файл</div>
          <div className={styles.icon}>
            <File />
          </div>
        </button>

        {/* Скрытые input'ы */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
      </div>
    </div>
  );
};
