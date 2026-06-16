'use client';

import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { useDownloadMessageFile } from 'modules/conversation/messages-chat/hooks/use-download-message-file';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useSelectedMessagesStore,
  useUserIdStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { ForvardCard } from '../../forward-card/forward-card';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import { HighlightedFileName } from '../highlighted-file-name/highlighted-file-name';
import DeleteFileIcon from '../icons/delete-file-icon.svg';
import FileIcon from '../icons/file-icon.svg';
import styles from './incoming-file-card.module.scss';
import { IncomingFileCardProps } from './incoming-file-card.props';

export const IncomingFileCard = ({
  message,
  sendDeleteMessage,
  search,
  register,
  isHighlighted,
  currentUserId,
}: IncomingFileCardProps): JSX.Element => {
  //размеры контекстного окна
  const menuWidth = 250;
  const menuHeight = 220;
  //показывать check-box при удалении либо нет
  const showCheckBox = false;
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
  // Получаем объект файла
  const files = message.files_list.length ? message.files_list : message.forwarded_messages[0]?.files_list;
  //хук для загрузки файла находящегося в сообщении
  const { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading } =
    useDownloadMessageFile(files);

  // прописываем в компоненте актуальный user_uid открытого чата из store
  const userId = useUserIdStore((s) => s.userId);
  // выясняем это простой чат либо группа (если true то группа)
  const hasGroup = userId.includes('group_');
  // получить размер файла
  //const sizeFile = formatBytes(message);
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
              {isFileImage ? (
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
                <div className={styles.fileSize}>5.2 MB</div>
                <div className={styles.messageTime}>{getMessageTime(message.created_at)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
