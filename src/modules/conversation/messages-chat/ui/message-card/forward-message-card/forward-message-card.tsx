'use client';
import Image from 'next/image';
import { JSX } from 'react';
import Close from '../icons/close.svg';
import FileIcon from '../icons/file.svg';
import PlayIcon from '../icons/play-icon.svg';
import styles from './forward-message-card.module.scss';
import type { ForwardMessageCardProps } from './forward-message-card.props';

export const ForwardMessageCard = ({
  forwardMessageStore,
  clearForwardMessageStore,
}: ForwardMessageCardProps): JSX.Element => {
  const handleCloseClick = (): void => {
    clearForwardMessageStore();
  };
  //выясняем картинка это или файл по расширению в названии файла (если true - картинка)
  const fileImage = ['.jpeg', '.png', '.gif', '.webp', '.jpg'];

  return (
    <div className={styles.wrapper}>
      <div className={styles.forwardBlock}>
        {(!!forwardMessageStore?.files_list.length ||
          !!forwardMessageStore?.forwarded_messages[0]?.files_list?.length) && (
          <div className={styles.fileIcon}>
            {forwardMessageStore?.content?.includes('voice_') ||
            forwardMessageStore?.forwarded_messages[0]?.content?.includes('voice_') ? (
              <PlayIcon />
            ) : fileImage.some(
                (word) =>
                  forwardMessageStore?.files_list[0]?.download_name?.toLowerCase().includes(word.toLowerCase()) ||
                  fileImage.some((word) =>
                    forwardMessageStore?.forwarded_messages[0]?.files_list[0]?.download_name
                      .toLowerCase()
                      .includes(word.toLowerCase()),
                  ),
              ) ? (
              <Image
                key={
                  forwardMessageStore?.files_list[0]?.uid ||
                  forwardMessageStore?.forwarded_messages[0]?.files_list[0]?.uid
                }
                src={
                  forwardMessageStore?.files_list[0]?.file_url ||
                  forwardMessageStore?.forwarded_messages[0]?.files_list[0]?.file_url
                }
                alt={
                  forwardMessageStore?.files_list[0]?.download_name ||
                  forwardMessageStore?.forwarded_messages[0]?.files_list[0]?.download_name
                }
                width={37}
                height={37}
              />
            ) : (
              <FileIcon />
            )}
          </div>
        )}
        <div className={styles.textBlock}>
          <div className={styles.text1}>Переслать сообщение</div>
          <div className={styles.text2}>
            {`${forwardMessageStore?.from_user.first_name} ${forwardMessageStore?.from_user.last_name}: `}
            {forwardMessageStore?.content?.includes('voice_')
              ? 'Голосовое сообщение'
              : (forwardMessageStore?.files_list?.length ||
                    forwardMessageStore?.forwarded_messages[0]?.files_list?.length) &&
                  forwardMessageStore.content === ' '
                ? 'Фото'
                : forwardMessageStore?.content}
          </div>
        </div>
        <div className={styles.icon}>
          <button onClick={handleCloseClick}>
            <Close />
          </button>
        </div>
      </div>
    </div>
  );
};
