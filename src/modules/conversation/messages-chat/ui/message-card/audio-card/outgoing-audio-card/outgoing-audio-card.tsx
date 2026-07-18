'use client';
import { useAudioPlayer } from 'modules/conversation/messages-chat/hooks/use-audio-player';
import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { formatTime } from 'modules/conversation/messages-chat/utils/format-cecond';
import {
  useIsDeletedFileStore,
  useSelectedMessagesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { HighlightedFileName } from '../../file-card/highlighted-file-name/highlighted-file-name';
import DeleteFileIcon from '../../file-card/icons/delete-file-icon.svg';
import { ForvardCard } from '../../forward-card/forward-card';
import CheckOneIcon from '../../icons/check-one.svg';
import CheckTwoIcon from '../../icons/check-two.svg';
import WatchIcon from '../../icons/watch.svg';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import AudioPlayIcon from '../icon/audio-play.svg';
import AudioStopIcon from '../icon/audio-stop.svg';
import styles from './outgoing-audio-card.module.scss';
import { OutgoingAudioCardProps } from './outgoing-audio-card.props';
export const OutgoingAudioCard = ({
  message,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
}: OutgoingAudioCardProps): JSX.Element => {
  //размеры контекстного окна
  const menuWidth = 250;
  const menuHeight = 220;
  //показывать check-box при удалении либо нет
  const showCheckBox = true;
  //надпись на check-box при удалении сообщения
  const labelCheckBox = `Удалить у меня и у ${message.to_user?.first_name !== '' ? message.to_user?.first_name : message.to_user?.nickname}`;
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
  } = useContextMenu({ menuWidth, menuHeight, sendDeleteMessage, message, showCheckBox, labelCheckBox });

  // показывать компоненты <MessageCheckBox/> в DOM либо нет
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);

  // мгновенно скрывает в DOM карточку файла, отправку которого отменил пользователь
  const isDeletedFileStore = useIsDeletedFileStore((s) => s.isDeletedFile);
  const setIsDeletedFileStore = useIsDeletedFileStore((s) => s.setIsDeletedFile);
  const handleDeleteFileClick = (): void => {
    setIsDeletedFileStore(true);
  };
  //эффект для удаления незагруженного файла (который имеет статус 'pending' либо 'failed' )
  useEffect(() => {
    if (isDeletedFileStore && message.status === 'sent') {
      sendDeleteMessage(message, true);
      setIsDeletedFileStore(false);
    }
  }, [isDeletedFileStore, message.status]);

  // находим url voice-сообщения
  const audioUrl = message.files_list.length
    ? message.files_list[0].file_protected_url
    : message.forwarded_messages[0]?.files_list[0]?.file_protected_url;
  // хук для прослушивания аудиосообщения
  const { handlePlayPause, currentTime, totalDuration, waveformRef, isPlaying, isLoading } = useAudioPlayer(
    message.uid,
    audioUrl || '',
  );

  return (
    <div className={(checkBoxsVisibleStore && has) || isHighlighted ? styles.blockSelected : styles.block}>
      {checkBoxsVisibleStore && (
        <MessageCheckBox message={message} selected={has} handleCheckBoxClick={handleCheckBoxClick} />
      )}
      <div
        className={styles.wrapper}
        onContextMenu={!checkBoxsVisibleStore ? handleContextMenu : (): void => {}}
        onClick={checkBoxsVisibleStore ? handleCheckBoxClick : (): void => {}}
        onMouseLeave={handleCloseMenu}
      >
        <ContextMenu
          position={contextMenuPos}
          visible={contextMenuVisible}
          onClose={handleCloseMenu}
          handleDeleteClick={handleDeleteClick}
          handleForwardClick={handleForwardClick}
          message={message}
        />
        {!isDeletedFileStore && (
          <div className={styles.item}>
            {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={false} />}
            {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
            <div className={styles.contentBlock}>
              <div className={styles.fileIcon}>
                {message.status === 'pending' || message.status === 'failed' ? (
                  <button onClick={handleDeleteFileClick} className={styles.deleteFileIcon}>
                    <DeleteFileIcon />
                  </button>
                ) : isLoading ? (
                  <DeleteFileIcon className={styles.deleteFileIcon} />
                ) : (
                  <button
                    onClick={!checkBoxsVisibleStore ? handlePlayPause : (): void => {}}
                    className={styles.fileIcon}
                  >
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
                  <div className={styles.messageTimeAndChatIcons}>
                    <div className={styles.messageTime}>{getMessageTime(message.created_at)}</div>
                    <div className={styles.messageChatIcons}>
                      {message.status === 'sent' && message.new === true && <CheckOneIcon />}
                      {(message.status === 'pending' || message.status === 'failed') && <WatchIcon />}
                      {message.new === false && <CheckTwoIcon />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
