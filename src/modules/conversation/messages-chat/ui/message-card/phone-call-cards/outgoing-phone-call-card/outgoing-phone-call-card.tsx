'use client';
import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { formatTime } from 'modules/conversation/messages-chat/utils/format-cecond';
import { useSelectedMessagesStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { HighlightedFileName } from '../../file-card/highlighted-file-name/highlighted-file-name';
import CheckOneIcon from '../../icons/check-one.svg';
import CheckTwoIcon from '../../icons/check-two.svg';
import WatchIcon from '../../icons/watch.svg';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import CanceledPhoneCallIcon from '../icons/canceled-phone-call.svg';
import OutgoingPhoneCallIcon from '../icons/outgoing-phone-call.svg';
import styles from './outgoing-phone-call-card.module.scss';
import type { OutgoingPhoneCallProps } from './outgoing-phone-call-card.props';

export const OutgoingPhoneCallCard = ({
  message,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
  status,
}: OutgoingPhoneCallProps): JSX.Element => {
  //размеры контекстного окна
  const menuWidth = 250;
  const menuHeight = 132;
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
          <div className={styles.contentBlock}>
            <div className={styles.phoneIcon}>
              {status === `Исходящий звонок` ? <OutgoingPhoneCallIcon /> : <CanceledPhoneCallIcon />}
            </div>
            <div className={styles.phoneInfo}>
              <div className={styles.text}>
                <HighlightedFileName fileName={status} search={search} />
              </div>
              <div className={styles.durationAndMessageTimeBlock}>
                <div className={styles.duration}>
                  {status === `Исходящий звонок` ? formatTime(message.message_rtc?.duration ?? 0) : ''}
                </div>
                <div className={styles.messageTimeAndChatIcons}>
                  <div className={styles.messageTime}>{getMessageTime(message.message_rtc?.created_at ?? 0)}</div>
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
      </div>
    </div>
  );
};
