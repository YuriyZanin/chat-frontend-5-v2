'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { JSX } from 'react';
import FileIcon from '../icons/file.svg';
import PlayIcon from '../icons/play-icon.svg';
import IncomingPhoneIcon from '../phone-call-cards/icons/inconing-phone-call.svg';
import styles from './reply-card.module.scss';
import type { ReplyCardProps } from './reply-card.props';

export const ReplyCard = ({ message, isIncomingMessage }: ReplyCardProps): JSX.Element => {
  //выясняем картинка это или файл по расширению в названии файла (если true - картинка)
  const fileImage = ['.jpeg', '.png', '.gif', '.webp', '.jpg'];
  return (
    <div className={clsx(styles.wrapper, isIncomingMessage ? styles.incomingWrapper : styles.outgoingWrapper)}>
      {!!message?.replied_messages[0].files_list.length && (
        <div className={styles.fileIcon}>
          {message.replied_messages[0].content?.includes('voice_') ? (
            <PlayIcon />
          ) : fileImage.some((word) =>
              message?.replied_messages[0].files_list[0].download_name.toLowerCase().includes(word.toLowerCase()),
            ) ? (
            <Image
              key={message?.replied_messages[0].files_list[0].uid}
              src={message?.replied_messages[0].files_list[0].file_webp_url || ''}
              alt={message?.replied_messages[0].files_list[0].download_name}
              width={37}
              height={37}
            />
          ) : (
            <FileIcon />
          )}
        </div>
      )}
      {message?.replied_messages[0].files_list?.length === 0 && message.replied_messages[0].content === ' ' && (
        <div className={styles.fileIcon}>
          <div className={styles.phoneIcon}>
            <IncomingPhoneIcon />
          </div>
        </div>
      )}
      <div className={styles.textBlock}>
        <div className={styles.text1}>
          {` ${message?.replied_messages[0].first_name} ${message?.replied_messages[0].last_name}`}
        </div>
        <div className={styles.text2}>
          {message?.replied_messages[0].content?.includes('voice_')
            ? `Голосовое сообщение`
            : message?.replied_messages[0].files_list?.length && message.replied_messages[0].content === ' '
              ? 'Фото'
              : message?.replied_messages[0].files_list?.length === 0 && message.replied_messages[0].content === ' '
                ? message?.replied_messages[0].from_user === message.from_user.uid
                  ? 'Исходящий звонок'
                  : 'Входящий звонок'
                : message?.replied_messages[0].content}
        </div>
      </div>
    </div>
  );
};
