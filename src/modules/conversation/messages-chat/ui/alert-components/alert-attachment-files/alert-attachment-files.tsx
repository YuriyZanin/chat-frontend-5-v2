'use client';
import { formatMessagesFile } from 'modules/conversation/messages-chat/utils/format-messages';
import {
  useAttachmentFilesStore,
  useTextForAttachmentFilesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX, useEffect, useRef, useState } from 'react';
import type { Attachment } from '../../context-menu/context-menu-attach-file/context-menu-attach-file.props';
import { AlertMessageInput } from '../alert-message-input/alert-message-input';
import styles from './alert-attachment-files.module.scss';
import type { AlertAttachmentFilesProps } from './alert-attachment-files.props';
import Close from './icons/close.svg';
import Delete from './icons/delete.svg';
import File from './icons/files.svg';
import Submit from './icons/submit.svg';

export const AlertAttachmentFiles = ({ onOk, onCancel }: AlertAttachmentFilesProps): JSX.Element => {
  const [textInput, setTextInput] = useState<string>('');
  const attachmentFilesStore = useAttachmentFilesStore((s) => s.attachmentFiles);
  const setTextForAttachmentFilesStore = useTextForAttachmentFilesStore((s) => s.setTextForAttachmentFiles);
  const clearAttachmentFilesStore = useAttachmentFilesStore((s) => s.clearAttachmentFiles);
  const clearTextForAttachmentFilesStore = useTextForAttachmentFilesStore((s) => s.clearTextForAttachmentFiles);

  // Берем только последние 10 файлов
  const last10Files = attachmentFilesStore.slice(-10);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Скролл с многократными попытками
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [last10Files]);
  const handleCloseClick = (): void => {
    clearAttachmentFilesStore();
    clearTextForAttachmentFilesStore();
    onCancel();
  };
  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    setTextForAttachmentFilesStore(textInput);
    setTextInput('');
    onOk();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerTop}>
        <div className={styles.textHeaderTop}>{`Отправить ${formatMessagesFile(last10Files.length)}`}</div>
        <button className={styles.icon} onClick={handleCloseClick}>
          <div className={styles.icon}>
            <Close />
          </div>
        </button>
      </div>
      <div className={styles.previewFilesList} ref={scrollContainerRef}>
        {last10Files.map((file) => (
          <PreviewFileCard key={file.id} file={file} />
        ))}
      </div>
      <form className={styles.headerBottomWrapper} onSubmit={handleSubmitForm}>
        <div className={styles.headerBottomBlock}>
          <AlertMessageInput textInput={textInput} setTextInput={setTextInput} />
          <button className={styles.headerBottomBlockIcon} type="submit">
            <div className={styles.headerBottomBlockIcon}>
              <Submit />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

const PreviewFileCard = ({ file }: { file: Attachment }): JSX.Element => {
  const deleteAttachmentFilesStore = useAttachmentFilesStore((s) => s.deleteAttachmentFiles);
  //выясняем картинка это или файл по расширению в названии файла (если true - картинка)
  const fileExtension = ['.jpeg', '.png', '.gif', '.webp', '.jpg'];
  const isFileImage = fileExtension.some((word) => file.fileData.filename.toLowerCase().includes(word.toLowerCase()));
  // Функция для получения размера в МБ
  const getFileSizeInMB = (attachment: Attachment): number => {
    const sizeInBytes = attachment.file.size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return Number(sizeInMB.toFixed(2)); // Округляем до 2 знаков
  };
  return (
    <div className={styles.previewFileCardWrapper}>
      <div className={styles.previewFileCardContent}>
        <div className={styles.previewFileCardContentAvatar}>
          <div className={styles.previewFileCardContentAvatar}>
            {isFileImage ? (
              <Image key={file.id} src={file.preview} alt={file.fileData.filename} width={48} height={48} />
            ) : (
              <File />
            )}
          </div>
        </div>
        <div className={styles.previewFileCardContentInfo}>
          <FileName fileName={file.fileData.filename} maxWidth={241} />
          <div className={styles.previewFileCardContentInfoSize}>{`${getFileSizeInMB(file)} МБ`}</div>
        </div>
      </div>
      <div className={styles.icon} onClick={() => deleteAttachmentFilesStore(file.id)}>
        <Delete />
      </div>
    </div>
  );
};

//этот компонент обрезает длинное название файла по центру и вставялет многоточие
export const FileName = ({ fileName, maxWidth = 241 }: { fileName: string; maxWidth?: number }): JSX.Element => {
  const [displayName, setDisplayName] = useState(fileName);
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const container = element.parentElement;
    if (!container) return;
    const containerWidth = maxWidth;
    // Создаем временный элемент для измерения
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
    if (measure(fileName) <= containerWidth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayName(fileName);
      return;
    }
    // Разделяем на имя и расширение
    const lastDot = fileName.lastIndexOf('.');
    const name = lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
    const extension = lastDot > 0 ? fileName.substring(lastDot) : '';
    // Обрезаем в центре
    let startLength = Math.floor(name.length / 2);
    let endLength = startLength;
    let truncated = `${name.substring(0, startLength)}...${name.substring(name.length - endLength)}${extension}`;
    while (measure(truncated) > containerWidth && (startLength > 3 || endLength > 3)) {
      if (startLength > 3) startLength--;
      if (endLength > 3) endLength--;
      truncated = `${name.substring(0, startLength)}...${name.substring(name.length - endLength)}${extension}`;
    }
    setDisplayName(truncated);
  }, [fileName, maxWidth]);

  return (
    <div ref={textRef} className={styles.previewFileCardContentInfoText} title={fileName}>
      {displayName}
    </div>
  );
};
