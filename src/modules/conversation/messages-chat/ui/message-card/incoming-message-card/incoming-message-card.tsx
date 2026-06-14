'use client';
import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useSelectedMessagesStore,
  useUserIdStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX } from 'react';
import { ContextMenu } from '../../context-menu/context-menu';
import { HighlightedMessage } from '../../search-messages/highlighted-message/highlighted-message';
import { ForvardCard } from '../forward-card/forward-card';
import { MessageCheckBox } from '../message-checkbox/message-checkbox';
import { ReplyCard } from '../reply-card/reply-card';
import styles from './incoming-message-card.module.scss';
import type { IncomingMessageCardProps } from './incoming-message.props';

export const IncomingMessagesCard = ({
  message,
  register,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
}: IncomingMessageCardProps): JSX.Element => {
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
          <div className={styles.box}>
            {hasGroup && (
              <div className={styles.name}> {`${message.from_user.first_name} ${message.from_user.last_name}`}</div>
            )}
            {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={true} />}
            {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
            <div className={styles.message}>
              <span className={styles.messageText}>
                <HighlightedMessage text={message.content ?? ''} search={search} />
              </span>
              <div className={styles.messageSentTime}>
                <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
