'use client';

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
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import IncomingPhoneIcon from '../icons/inconing-phone-call.svg';
import MissedPhoneIcon from '../icons/missed-phone-call.svg';
import styles from './incoming-phone-call-card.module.scss';
import { IncomingPhoneCallProps } from './incoming-phone-call-card.props';

export const IncomingPhoneCallCard = ({
  message,
  sendDeleteMessage,
  search,
  register,
  isHighlighted,
  currentUserId,
  status,
}: IncomingPhoneCallProps): JSX.Element => {
  //размеры контекстного окна
  const menuWidth = 250;
  const menuHeight = 132;
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
          {hasGroup && (
            <div className={styles.name}> {`${message.from_user.first_name} ${message.from_user.last_name}`}</div>
          )}
          {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={false} />}
          <div className={styles.contentBlock}>
            <div className={styles.phoneIcon}>
              {status === 'Входящий звонок' ? <IncomingPhoneIcon /> : <MissedPhoneIcon />}
            </div>
            <div className={styles.phoneInfo}>
              <div className={styles.text}>
                <HighlightedFileName fileName={status} search={search} />
              </div>
              <div className={styles.durationAndMessageTimeBlock}>
                <div className={styles.duration}>
                  {status === 'Входящий звонок' ? formatTime(message.message_rtc?.duration ?? 0) : ''}
                </div>
                <div className={styles.messageTime}>{getMessageTime(message.message_rtc?.created_at ?? 0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
