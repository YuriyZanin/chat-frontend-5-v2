'use client';

import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { useDownloadMessageFile } from 'modules/conversation/messages-chat/hooks/use-download-message-file';
import { useFileSizeText } from 'modules/conversation/messages-chat/hooks/use-file-size-text';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useIsDeletedFileStore,
  useSelectedMessagesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX, useEffect, useMemo } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { ForvardCard } from '../../forward-card/forward-card';
import CheckOneIcon from '../../icons/check-one.svg';
import CheckTwoIcon from '../../icons/check-two.svg';
import WatchIcon from '../../icons/watch.svg';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import { HighlightedFileName } from '../highlighted-file-name/highlighted-file-name';
import DeleteFileIcon from '../icons/delete-file-icon.svg';
import FileIcon from '../icons/file-icon.svg';
import styles from './outgoing-file-card.module.scss';
import { OutgoingFileCardProps } from './outgoing-file-card.props';

export const OutgoingFileCard = ({
  message,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
}: OutgoingFileCardProps): JSX.Element => {
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

  //выясняем картинка это или файл по расширению в названии файла (если true - картинка)
  const fileImage = ['.jpeg', '.png', '.gif', '.webp', '.jpg'];
  let isFileImage: boolean | null = null;
  if (message.files_list.length) {
    isFileImage = fileImage.some((word) =>
      message.files_list[0].download_name.toLowerCase().includes(word.toLowerCase()),
    );
  } else {
    isFileImage = fileImage.some((word) =>
      message.forwarded_messages[0].files_list[0].download_name.toLowerCase().includes(word.toLowerCase()),
    );
  }
  // получаем из сообщения (message) url где находится файл
  const fileForSize = useMemo(() => {
    const f = message.files_list.length ? message.files_list[0] : message.forwarded_messages[0].files_list[0];
    return f.file_protected_url || f.file_webp_url || null;
  }, [message]);
  //хук для асинхронного получения размера файла по url
  const { fileSizeText } = useFileSizeText({ url: fileForSize });
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

  // Получаем объект файла
  const files = message.files_list.length ? message.files_list : message.forwarded_messages[0]?.files_list;
  //хук для загрузки файла находящегося в сообщении
  const { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading } =
    useDownloadMessageFile(files);

  return (
    <div className={(checkBoxsVisibleStore && has) || isHighlighted ? styles.blockSelected : styles.block}>
      {checkBoxsVisibleStore && (
        <MessageCheckBox message={message} selected={has} handleCheckBoxClick={handleCheckBoxClick} />
      )}
      <div
        className={styles.wrapper}
        onContextMenu={!checkBoxsVisibleStore ? handleContextMenu : (): void => {}}
        onMouseLeave={handleCloseMenu}
        onClick={checkBoxsVisibleStore ? handleCheckBoxClick : (): void => {}}
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
                ) : isFileImage ? (
                  isDownloading ? (
                    <button onClick={handleStopDownloadMessageFileClick} className={styles.deleteFileIcon}>
                      <DeleteFileIcon />
                    </button>
                  ) : (
                    <button
                      onClick={!checkBoxsVisibleStore ? handleDownloadMessageFileClick : (): void => {}}
                      className={styles.fileIcon}
                    >
                      <Image
                        key={
                          message.files_list.length
                            ? message.files_list[0].uid
                            : message.forwarded_messages[0].files_list[0].id
                        }
                        src={
                          message.files_list.length
                            ? message.files_list[0].file_webp_url || ''
                            : message.forwarded_messages[0].files_list[0].file_webp_url || ''
                        }
                        alt={
                          message.files_list.length
                            ? message.files_list[0].download_name
                            : message.forwarded_messages[0].files_list[0].download_name
                        }
                        width={48}
                        height={48}
                      />
                    </button>
                  )
                ) : isDownloading ? (
                  <button onClick={handleStopDownloadMessageFileClick} className={styles.deleteFileIcon}>
                    <DeleteFileIcon />
                  </button>
                ) : (
                  <button onClick={!checkBoxsVisibleStore ? handleDownloadMessageFileClick : (): void => {}}>
                    <FileIcon />
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
                <div className={styles.fileSizeAndMessageTimeBlock}>
                  <div className={styles.fileSize}>{fileSizeText}</div>
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
