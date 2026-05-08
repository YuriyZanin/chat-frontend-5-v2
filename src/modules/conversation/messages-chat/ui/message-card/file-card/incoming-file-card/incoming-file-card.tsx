'use client';

import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { useDownloadMessageFile } from 'modules/conversation/messages-chat/hooks/use-download-message-file';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
  useUserIdStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, MouseEvent, useEffect, useRef, useState } from 'react';
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
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const menuWidth = 250;
    const menuHeight = 220;
    const x = event.pageX;
    const y = event.pageY;
    const adjustedX = x + 5;
    const adjustedY = y - menuHeight - 5;
    const constrainedX =
      adjustedX + menuWidth > window.innerWidth - window.innerWidth / 3.77 ? x - menuWidth - 5 : adjustedX;
    const constrainedY = adjustedY < 150 ? y + 5 : adjustedY;
    setContextMenuPos({ x: constrainedX, y: constrainedY });
    setContextMenuVisible(true);
  };

  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };

  const { confirm } = useAlert();
  const selectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.selectedUidUserForForwardMessage,
  );
  const selectedUidUserForForwardMessageRef = useRef<string>(selectedUidUserForForwardMessageStore);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  useEffect(() => {
    selectedUidUserForForwardMessageRef.current = selectedUidUserForForwardMessageStore;
  }, [selectedUidUserForForwardMessageStore, selectedUidUserForForwardMessageRef]);

  const handleDeleteClick = async (): Promise<void> => {
    const ok = await confirm({
      title: 'Удалить сообщение',
      message: 'Вы действительно хотите удалить сообщение?',
      showCheckBox: false,
    });

    if (ok) {
      // вызываем переданный обработчик удаления
      sendDeleteMessage(message);
    } else {
      // отмена — ничего не делаем
    }
  };
  const setForwardMessageStore = useForwardMessageStore((s) => s.setForwardMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);
  const router = useRouter();

  const handleForwardClick = async (): Promise<void> => {
    const ok = await confirm({
      isMessageForwarding: true,
    });
    if (ok && selectedUidUserForForwardMessageRef.current) {
      setForwardMessageStore(message);
      clearRepliedMessageStore();
      clearSelectedMessagesStore();
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
    }
  };
  // выясняем имеется ли "message" в массиве выбранных сообщений ("selectedMessagesStore")
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages);
  const addSelectedMessagesStore = useSelectedMessagesStore((s) => s.addSelectedMessages);
  const deleteSelectedMessagesStore = useSelectedMessagesStore((s) => s.deleteSelectedMessages);

  const [selected, setSelected] = useState<boolean>(true);
  const has = selectedMessagesStore?.some((selectedMessage) => selectedMessage.uid === message.uid);

  const handleCheckBoxClick = (): void => {
    setSelected(!selected);
    if (selected) {
      addSelectedMessagesStore(message);
    } else {
      deleteSelectedMessagesStore(message);
    }
  };
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
  //хук для загрузки файла находящегося в сообщении
  const { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading } =
    useDownloadMessageFile(message);
  // прописываем в компоненте актуальный user_uid открытого чата из store
  const userId = useUserIdStore((s) => s.userId);
  // выясняем это простой чат либо группа (если true то группа)
  const hasGroup = userId.includes('group_');

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
              {isFileImage ? (
                isDownloading ? (
                  <button onClick={handleStopDownloadMessageFileClick} className={styles.deleteFileIcon}>
                    <DeleteFileIcon />
                  </button>
                ) : (
                  <button onClick={handleDownloadMessageFileClick} className={styles.fileIcon}>
                    <Image
                      key={
                        message.files_list.length
                          ? message.files_list[0].uid
                          : message.forwarded_messages[0].files_list[0].id
                      }
                      src={
                        message.files_list.length
                          ? message.files_list[0].file_url
                          : message.forwarded_messages[0].files_list[0].file_url
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
                <button onClick={handleDownloadMessageFileClick}>
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
                <div className={styles.fileSize}>5.2 MБ</div>
                <div className={styles.messageTime}>{getMessageTime(message.created_at)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
