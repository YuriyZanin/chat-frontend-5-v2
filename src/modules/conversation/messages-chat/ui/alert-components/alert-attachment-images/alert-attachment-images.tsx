'use client';
import clsx from 'clsx';
import {
  useAttachmentImagesStore,
  useTextForAttachmentImagesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX, useState } from 'react';
import { AlertMessageInput } from '../alert-message-input/alert-message-input';
import styles from './alert-attachment-images.module.scss';
import type { AlertAttachmentImageProps, PreviewImageCardProps } from './alert-attachment-images.props';
import Close from './icons/close.svg';
import Delete from './icons/delete.svg';
import Submit from './icons/submit.svg';

export const AlertAttachmentImages = ({ onOk, onCancel }: AlertAttachmentImageProps): JSX.Element => {
  const [textInput, setTextInput] = useState<string>('');
  const attachmentImagesStore = useAttachmentImagesStore((s) => s.attachmentImages);
  const setTextForAttachmentImagesStore = useTextForAttachmentImagesStore((s) => s.setTextForAttachmentImages);
  const clearAttachmentImagesStore = useAttachmentImagesStore((s) => s.clearAttachmentImages);
  const clearTextForAttachmentImagesStore = useTextForAttachmentImagesStore((s) => s.clearTextForAttachmentImages);

  // Берем только последние 4 выбранные картинки
  const last4Images = attachmentImagesStore.slice(-4);

  const handleCloseClick = (): void => {
    clearAttachmentImagesStore();
    clearTextForAttachmentImagesStore();
    onCancel();
  };
  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    setTextForAttachmentImagesStore(textInput);
    setTextInput('');
    onOk();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerTop}>
        <div className={styles.textHeaderTop}>Отправить медиа-файл</div>
        <button className={styles.icon} onClick={handleCloseClick}>
          <div className={styles.icon}>
            <Close />
          </div>
        </button>
      </div>
      <div className={clsx(styles.previewImages, styles[`previewImages--${last4Images.length}`])}>
        {last4Images.map((image) => (
          <PreviewImageCard key={image.id} image={image} />
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

const PreviewImageCard = ({ image }: PreviewImageCardProps): JSX.Element => {
  const deleteAttachmentImagesStore = useAttachmentImagesStore((s) => s.deleteAttachmentImages);
  //выясняем картинка это или нет по расширению в названии файла (если true - картинка)
  const fileExtension = ['.jpeg', '.png', '.gif', '.webp', '.jpg'];
  const isFileImage = fileExtension.some((word) => image.fileData.filename.toLowerCase().includes(word.toLowerCase()));
  return (
    <div className={styles.image}>
      {isFileImage && (
        <>
          <Image key={image.id} src={image.preview} alt={image.fileData.filename} width={384} height={384} />
          <div className={styles.deleteButton} onClick={() => deleteAttachmentImagesStore(image.id)}>
            <Delete />
          </div>
        </>
      )}
    </div>
  );
};
