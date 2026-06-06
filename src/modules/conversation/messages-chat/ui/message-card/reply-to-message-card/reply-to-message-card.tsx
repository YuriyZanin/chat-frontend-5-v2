'use client';
import { useUserIdStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX, useEffect, useRef } from 'react';
import Close from '../icons/close.svg';
import FileIcon from '../icons/file.svg';
import PlayIcon from '../icons/play-icon.svg';
import IncomingPhoneIcon from '../phone-call-cards/icons/inconing-phone-call.svg';
import styles from './reply-to-message-card.module.scss';
import type { ReplyToMessageCardProps } from './reply-to-message-card.props';

export const ReplyToMessageCard = ({
  repliedMessageStore,
  clearRepliedMessageStore,
}: ReplyToMessageCardProps): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const prevUserIdRef = useRef<string | null>(userIdStore);
  //если переходим в другой чат то <ReplyToMessageCard> автоматически закрывается
  useEffect(() => {
    if (prevUserIdRef.current !== userIdStore) {
      clearRepliedMessageStore();
      prevUserIdRef.current = userIdStore;
    }
  }, [userIdStore]);

  const handleCloseClick = (): void => {
    clearRepliedMessageStore();
  };
  //выясняем картинка это или файл по расширению в названии файла (если true - картинка)
  const fileImage = ['.jpeg', '.png', '.gif', '.webp', '.jpg'];

  return (
    <div className={styles.wrapper}>
      <div className={styles.forwardBlock}>
        <div className={styles.fileIconAndText}>
          {(!!repliedMessageStore?.files_list.length ||
            !!repliedMessageStore?.forwarded_messages[0]?.files_list?.length) && (
            <div className={styles.fileIcon}>
              {repliedMessageStore?.content?.includes('voice_') ||
              repliedMessageStore?.forwarded_messages[0]?.content?.includes('voice_') ? (
                <PlayIcon />
              ) : fileImage.some(
                  (word) =>
                    repliedMessageStore?.files_list[0]?.download_name?.toLowerCase().includes(word.toLowerCase()) ||
                    fileImage.some((word) =>
                      repliedMessageStore?.forwarded_messages[0]?.files_list[0]?.download_name
                        .toLowerCase()
                        .includes(word.toLowerCase()),
                    ),
                ) ? (
                <Image
                  key={
                    repliedMessageStore?.files_list[0]?.uid ||
                    repliedMessageStore?.forwarded_messages[0]?.files_list[0]?.uid
                  }
                  src={
                    repliedMessageStore?.files_list[0]?.file_webp_url ||
                    repliedMessageStore?.forwarded_messages[0]?.files_list[0]?.file_webp_url
                  }
                  alt={
                    repliedMessageStore?.files_list[0]?.download_name ||
                    repliedMessageStore?.forwarded_messages[0]?.files_list[0]?.download_name
                  }
                  width={37}
                  height={37}
                />
              ) : (
                <FileIcon />
              )}
            </div>
          )}
          {repliedMessageStore?.message_rtc !== null && (
            <div className={styles.fileIcon}>
              <div className={styles.phoneIcon}>
                <IncomingPhoneIcon />
              </div>
            </div>
          )}
          <div className={styles.textBlock}>
            <div className={styles.text1}>
              В ответ
              <span className={styles.text11}>
                {repliedMessageStore?.forwarded_messages.length
                  ? ` ${repliedMessageStore?.forwarded_messages[0].first_name}`
                  : ` ${repliedMessageStore?.from_user.first_name} ${repliedMessageStore?.from_user.last_name}`}
              </span>
            </div>
            <div className={styles.text2}>
              {repliedMessageStore?.content?.includes('voice_')
                ? `Голосовое сообщение`
                : (repliedMessageStore?.files_list?.length ||
                      repliedMessageStore?.forwarded_messages[0]?.files_list?.length) &&
                    repliedMessageStore.content === ' '
                  ? 'Фото'
                  : repliedMessageStore?.message_rtc === null
                    ? repliedMessageStore?.content
                    : repliedMessageStore?.from_user.uid === userIdStore
                      ? 'Входящий звонок'
                      : 'Исходящий звонок'}
            </div>
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
