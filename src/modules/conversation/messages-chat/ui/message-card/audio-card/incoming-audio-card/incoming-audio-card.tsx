'use client';

import { useAudioPlayer } from 'modules/conversation/messages-chat/hooks/use-audio-player';
import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { formatTime } from 'modules/conversation/messages-chat/utils/format-cecond';
import {
  useSelectedMessagesStore,
  useUserIdStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { HighlightedFileName } from '../../file-card/highlighted-file-name/highlighted-file-name';
import DeleteFileIcon from '../../file-card/icons/delete-file-icon.svg';
import { ForvardCard } from '../../forward-card/forward-card';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import AudioPlayIcon from '../icon/audio-play.svg';
import AudioStopIcon from '../icon/audio-stop.svg';
import styles from './incoming-audio-card.module.scss';
import { IncomingAudioCardProps } from './incoming-audio-card.props';

export const IncomingAudioCard = ({
  message,
  sendDeleteMessage,
  search,
  register,
  isHighlighted,
  currentUserId,
}: IncomingAudioCardProps): JSX.Element => {
  //размеры контекстного окна
  const menuWidth = 250;
  const menuHeight = 220;
  //показывать check-box при удалении либо нет
  const showCheckBox = false;
  //хук для обработчиков контекстного меню сообщения
  const {
    handleContextMenu,
    handleCloseMenu,
    handleDeleteClick,
    handleForwardClick,
    handleCheckBoxClick,
    contextMenuPos,
    contextMenuVisible,
    has,
  } = useContextMenu({ menuWidth, menuHeight, sendDeleteMessage, message, showCheckBox });
  // показывать компоненты <MessageCheckBox/> в DOM либо нет
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);
  // прописываем в компоненте актуальный user_uid открытого чата из store
  const userId = useUserIdStore((s) => s.userId);
  // выясняем это простой чат либо группа (если true то группа)
  const hasGroup = userId.includes('group_');
  // хук для прослушивания аудиосообщения
  const { handlePlayPause, currentTime, totalDuration, waveformRef, isPlaying, isLoading } = useAudioPlayer(message);

  return (
    <div className={(checkBoxsVisibleStore && has) || isHighlighted ? styles.blockSelected : styles.block}>
      {checkBoxsVisibleStore && (
        <MessageCheckBox message={message} selected={has} handleCheckBoxClick={handleCheckBoxClick} />
      )}
      <div
        className={styles.wrapper}
        onContextMenu={!checkBoxsVisibleStore ? handleContextMenu : (): void => {}}
        onMouseLeave={handleCloseMenu}
        ref={(el) => {
          register(el, message);
        }}
      >
        <ContextMenu
          position={contextMenuPos}
          visible={contextMenuVisible}
          onClose={handleCloseMenu}
          handleDeleteClick={handleDeleteClick}
          handleForwardClick={handleForwardClick}
          message={message}
        />
        {hasGroup && (
          <div className={styles.avatar}>
            {message.from_user.avatar_webp_url ? (
              <Image
                key={message.from_user.uid}
                src={message.from_user.avatar_webp_url}
                alt={message.from_user.username}
                width={32}
                height={32}
              />
            ) : (
              <Image src="/images/messages-chats/default-avatar.svg" alt="Дефолтный Аватар" width={32} height={32} />
            )}
          </div>
        )}
        <div className={styles.item}>
          {hasGroup && (
            <div className={styles.name}> {`${message.from_user.first_name} ${message.from_user.last_name}`}</div>
          )}
          {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={false} />}
          {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
          <div className={styles.contentBlock}>
            <div className={styles.fileIcon}>
              {isLoading ? (
                <DeleteFileIcon />
              ) : (
                <button onClick={handlePlayPause} className={styles.fileIcon}>
                  {isPlaying ? <AudioStopIcon /> : <AudioPlayIcon />}
                </button>
              )}
            </div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>
                <HighlightedFileName
                  fileName={
                    message.files_list.length
                      ? message.files_list[0].download_name
                      : message.forwarded_messages[0].files_list[0].download_name
                  }
                  search={search}
                />
              </div>
              <div className={styles.voiceLine} ref={waveformRef} />
              <div className={styles.fileSizeAndMessageTimeBlock}>
                <div className={styles.fileSize}>
                  {currentTime ? formatTime(currentTime) : formatTime(totalDuration)}
                </div>
                <div className={styles.messageTime}>{getMessageTime(message.created_at)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
