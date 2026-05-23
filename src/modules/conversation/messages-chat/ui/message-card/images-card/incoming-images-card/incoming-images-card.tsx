'use client';
import clsx from 'clsx';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useSelectedMessagesStore,
  useUserIdStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { HighlightedMessage } from '../../../search-messages/highlighted-message/highlighted-message';
import { ForvardCard } from '../../forward-card/forward-card';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import styles from './incoming-images-card.module.scss';
import type { IncomingImagesCardProps } from './incoming-images-card.props';

export const IncomingImagesCard = ({
  message,
  sendDeleteMessage,
  search,
  register,
  isHighlighted,
  currentUserId,
}: IncomingImagesCardProps): JSX.Element => {
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
  const fileList = message.files_list.length ? message.files_list : message.forwarded_messages[0].files_list;

  // блок вызова модального окна с обработчиком для отправки сообщения и вложенных файлов
  const { confirm } = useAlert();
  const handleOpenImages = async (): Promise<void> => {
    const ok = await confirm({
      openImages: { isOpenImages: true, message, isIncomingCard: true, sendDeleteMessage },
    });
  };
  return (
    <div className={(checkBoxsVisibleStore && has) || isHighlighted ? styles.blockSelected : styles.block}>
      {checkBoxsVisibleStore && (
        <MessageCheckBox message={message} selected={has} handleCheckBoxClick={handleCheckBoxClick} />
      )}
      <div
        className={styles.wrapperBlock}
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
        <div className={styles.wrapper}>
          {hasGroup && (
            <div className={styles.name}> {`${message.from_user.first_name} ${message.from_user.last_name}`}</div>
          )}
          <div className={styles.replyAndForward}>
            {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={false} />}
            {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
          </div>
          <div className={clsx(styles.previewImages, styles[`previewImages--${fileList.length}`])}>
            {fileList.map((image) => (
              <div key={image.uid} className={styles.image} onClick={handleOpenImages}>
                <Image src={image.file_url} alt={image.download_name} width={500} height={376} />
              </div>
            ))}
          </div>
          {message.content && message.content !== ' ' ? (
            <div className={styles.item}>
              <div className={styles.message}>
                <div className={styles.messageText}>
                  <HighlightedMessage text={message.content ?? ''} search={search} />
                </div>
                <div className={styles.messageSentTime}>
                  <div className={styles.messageTime}>{getMessageTime(message.created_at)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.messageSentTimeImg}>
              <div className={styles.messageTimeImg}>{getMessageTime(message.created_at)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
