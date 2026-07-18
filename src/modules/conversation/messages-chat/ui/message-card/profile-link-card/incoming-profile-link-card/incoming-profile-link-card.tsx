'use client';
import { useSearchUsersQuery } from 'modules/conversation/contacts/api';
import { useContextMenu } from 'modules/conversation/messages-chat/hooks/use-context-menu';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useSelectedMessagesStore,
  useUserIdStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useInfoStore } from 'modules/info/model/info.store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { HighlightedMessage } from '../../../search-messages/highlighted-message/highlighted-message';
import { ForvardCard } from '../../forward-card/forward-card';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import styles from './incoming-profile-link-card.module.scss';
import type { IncomingProfileLinkCardProps } from './incoming-profile-link-card.props';

export const IncomingProfileLinkCard = ({
  message,
  register,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
}: IncomingProfileLinkCardProps): JSX.Element => {
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
  const nickname = message.content && message.content.split('/').pop();
  const { data: userProfile } = useSearchUsersQuery(nickname ?? '');
  const router = useRouter();
  const { setIsInfoOpen } = useInfoStore();

  const handleSendMessages = (): void => {
    router.push(`/contacts/${userProfile?.length ? userProfile[0].uid : ''}`);
    setIsInfoOpen(false);
  };
  const handleContactProfile = (): void => {
    router.push(`/contacts/${userProfile?.length ? userProfile[0].uid : ''}`);
    setIsInfoOpen(true);
  };

  const URL_DEFAUIT_Avatar = '/images/messages-chats/default-avatar.svg';
  // создаем состояние которое динамически заменить картинку аватара на дефолтную в случае ошибки при её загрузке
  const [imgSrc, setImgSrc] = useState(userProfile?.length ? userProfile[0].avatarUrl : URL_DEFAUIT_Avatar);

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
            {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
            <div className={styles.replyMessage}>
              <div className={styles.avatar}>
                <Image
                  src={imgSrc}
                  alt={userProfile?.length ? `${userProfile[0].firstName} ${userProfile[0].lastName}` : ''}
                  unoptimized
                  width={37}
                  height={37}
                  onError={() => {
                    setImgSrc(URL_DEFAUIT_Avatar);
                  }}
                />
              </div>
              <div className={styles.textBlock}>
                <div className={styles.nameBlock}>
                  <div className={styles.name}>
                    {userProfile?.length ? `${userProfile[0].firstName} ${userProfile[0].lastName}` : ''}
                  </div>
                  <div className={styles.nickname}>{`@${nickname}`}</div>
                </div>
                <div className={styles.join} onClick={handleSendMessages}>
                  Отправить сообщение
                </div>
              </div>
            </div>
            <div className={styles.message}>
              <span className={styles.messageText} onClick={handleContactProfile}>
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
