'use client';

import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { useSelectedMessagesStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX } from 'react';
import { ContextMenu } from '../../context-menu/context-menu';
import { HighlightedMessage } from '../../search-messages/highlighted-message/highlighted-message';
import { ForvardCard } from '../forward-card/forward-card';
import CheckOneIcon from '../icons/check-one.svg';
import CheckTwoIcon from '../icons/check-two.svg';
import WatchIcon from '../icons/watch.svg';
import { MessageCheckBox } from '../message-checkbox/message-checkbox';
import { ReplyCard } from '../reply-card/reply-card';
import styles from './outgoing-message-card.module.scss';
import { OutgoingMessagesCardProps } from './outgoing-message-card.props';

export const OutgoingMessagesCard = ({
  message,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
}: OutgoingMessagesCardProps): JSX.Element => {
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
        <div className={styles.item}>
          {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={false} />}
          {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
          <div className={styles.message}>
            <span className={styles.messageText}>
              <HighlightedMessage text={message.content ?? ''} search={search} />
            </span>
            <div className={styles.messageSentTime}>
              <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
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
  );
};
