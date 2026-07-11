'use client';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useSelectedUidUserForForwardMessageStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import Image from 'next/image';
import { JSX, useEffect, useRef } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import styles from './alert-forward.module.scss';
import type { AlertForwardChatCardProps } from './alert-forward.props';
import { AlertForwardProps } from './alert-forward.props';
import Close from './icons/close.svg';
import DefauitBox from './icons/default-box.svg';
import Search from './icons/search.svg';

const URL_DEFAUIT_Avatar = '/images/messages-chats/default-avatar.svg';
const URL_DEFAUIT_Avatar_Croup = '/images/messages-chats/default-avatar-group.svg';

export const AlertForward = ({ onOk, onCancel }: AlertForwardProps): JSX.Element => {
  const { modalChats, modalSearch, setModalSearch, clearModalSearch, statusModal } = useChatsScreen();
  const inputRef = useRef<HTMLInputElement | null>(null);
  //устанавливае изначально фокус на <input> поиска
  useEffect(() => {
    inputRef.current?.focus();
    return (): void => {
      clearModalSearch();
    };
  }, []);
  const handlerOnClickInput = (): void => {
    clearModalSearch();
    inputRef.current?.focus();
  };
  return (
    <div
      className={styles.wrapper}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      }}
    >
      <div className={styles.headerTop}>
        <div className={styles.textHeaderTop}>Переслать</div>
        <button onClick={onCancel}>
          <div className={styles.icon}>
            <Close />
          </div>
        </button>
      </div>
      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <div className={styles.icon}>
            <Search />
          </div>
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={modalSearch}
            onChange={(e) => setModalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                clearModalSearch();
              }
            }}
            placeholder="Поиск"
            aria-label="Поиск чатов"
          />
          {modalSearch && (
            <button>
              <div className={styles.icon}>
                <Close onClick={handlerOnClickInput} />
              </div>
            </button>
          )}
        </div>
      </div>
      {!!modalChats.length &&
        modalChats.map((chat) => {
          return <AlertForwardChatCard key={chat.chat.id} chat={chat} onOk={onOk} clearSearch={clearModalSearch} />;
        })}
      {modalSearch && !modalChats.length && statusModal === 'success' && <DefauitBox />}
    </div>
  );
};

const AlertForwardChatCard = ({ chat, onOk, clearSearch }: AlertForwardChatCardProps): JSX.Element => {
  const { avatarUrl = '', firstName = '', lastName = '', wasOnlineAt = null, nickname = '' } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);
  const setSelectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.setSelectedUidUserForForwardMessage,
  );
  const handlerOnClick = (): void => {
    if (chat.chat.chatType === 'chat') {
      setSelectedUidUserForForwardMessageStore(chat.peer.uid);
    } else {
      setSelectedUidUserForForwardMessageStore(`group_${chat.peer.uid}`);
    }
    clearSearch?.();
    onOk();
  };
  // создаем url для запроса аватара через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain(avatarUrl)}`;

  return (
    <div className={styles.cardWrapper} onClick={handlerOnClick}>
      <div className={styles.avatar}>
        <Image
          src={
            result !== '/api/proxy'
              ? result
              : chat.chat.chatKey.includes('group') || chat.chat.chatKey.includes('channel')
                ? URL_DEFAUIT_Avatar_Croup
                : URL_DEFAUIT_Avatar
          }
          alt="Аватар"
          unoptimized
          width={40}
          height={40}
        />
      </div>
      <div className={styles.nameEndStatus}>
        <div className={styles.name}>
          {firstName === '' && lastName === '' ? `${nickname}` : `${firstName} ${lastName}`}
        </div>
        <div className={styles.status}>{status}</div>
      </div>
    </div>
  );
};
