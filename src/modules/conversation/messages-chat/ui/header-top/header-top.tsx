'use client';
import clsx from 'clsx';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useCallsStore } from 'modules/conversation/messages-chat/model/calls/calls.store';
import { useInfoProfileQuery } from 'modules/info/api';
import { useInfoStore } from 'modules/info/model/info.store';
import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { UnblockContactModal } from 'modules/info/ui/unblock-contact-modal';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import Image from 'next/image';
import { JSX, useEffect, useState } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ButtonUI } from 'shared/ui';
import { NotificationModal } from '../../../../notification/ui/notification-modal';
import { useWebSocketChatStore } from '../../api/web-socket/use-web-socket-chat-store';
import { formatParticipants } from '../../utils/format-messages';
import { IncomingCallPanel } from '../../widgets/incoming-call-panel';
import { OutgoingCallPanel } from '../../widgets/outgoing-call-panel';
import { ReceivingCallPanel } from '../../widgets/receiving-call-panel';
import {
  useHeaderButtonsModalStore,
  useSearchIndicatorStore,
  useSearchMessagesStore,
} from '../../zustand-store/zustand-store';
import { AddModal } from '../header-top-buttons-block/add-modal';
import { BlockModal } from '../header-top-buttons-block/block-modal';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import { LeaveGroupModal } from '../header-top-buttons-block/leave-group-modal';
import { SearchResultCard } from '../search-messages/search-result-card/search-result-card';
import { SearchMessages } from '../search-messages/search/search-messages';
import styles from './header-top.module.scss';
import type { HeaderTopProps } from './header-top.props';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';
const URL_DEFAUIT_Avatar = '/images/messages-chats/default-avatar.svg';
const URL_DEFAUIT_Avatar_Croup = '/images/messages-chats/default-avatar-group.svg';

export const HeaderTop = ({ user_uid, currentUid, chatOrContact }: HeaderTopProps): JSX.Element => {
  //хук для получения списка чатов
  const { chats } = useChatsScreen();
  //хук для получения списка участников опреденной группы/канала (по chat_key)
  const { participants } = useParticipantsScreen(user_uid);
  const isGroupOrChannel = user_uid.startsWith('group') || user_uid.startsWith('channel');
  const chat = isGroupOrChannel
    ? chats.find((c) => c.chat.chatKey === user_uid)
    : chats.find((c) => c.peer.uid === user_uid);
  const parts = user_uid.split('_');
  const userUid = parts.length > 1 ? parts[1] : parts[0];
  //xук для получения профиля определенного (uid) пользователя
  const { data: profile, isLoading } = useInfoProfileQuery(userUid);
  let resultProfile;

  if (chatOrContact === 'chat') {
    resultProfile = {
      avatarUrl: chat?.peer.avatarUrl || '',
      firstName: chat?.peer.firstName || '',
      lastName: chat?.peer.lastName || '',
      nickname: chat?.peer.nickname || '',
      isBlocked: chat?.peer.isBlocked || false,
      isInContacts: chat?.peer.isInContacts || false,
      status: getLastSeenLabel(chat?.peer.wasOnlineAt || null),
    };
  } else {
    resultProfile = {
      avatarUrl: profile?.avatar || profile?.avatarUrl || profile?.avatarWebp || profile?.avatarWebpUrl || '',
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      nickname: profile?.nickname || '',
      isBlocked: profile?.isBlocked || false,
      isInContacts: false,
      status: getLastSeenLabel(profile?.wasOnlineAt || null),
    };
  }
  const { avatarUrl, firstName, lastName, nickname, isBlocked, isInContacts, status } = resultProfile;
  const [searchMessagesVisible, setSearchMessagesVisible] = useState<boolean>(false);

  const {
    isCallModalOpen,
    isIncomingModalOpen,
    isReceivingModalOpen,
    messageRtcUid,
    fromUserUid,
    toggleCallsOpen,
    toggleIncomingModalOpen,
  } = useCallsStore();
  const { isInfoOpen, isUnblockModalOpen, toggleInfoOpen, openUnblockModal } = useInfoStore();
  // const { openUnblockModal } = useInfoStore((s) => s.openUnblockModal);
  const { isModalOpen } = useNotificationStore();
  const { isBlockModalOpen, isAddModalOpen, isLeaveGroupModalOpen, closeButtonMenu, openButtonMenu } =
    useHeaderButtonsModalStore();
  const searchIndicatorStore = useSearchIndicatorStore((s) => s.searchIndicator);
  const searchMessagesStore = useSearchMessagesStore((s) => s.searchMessages);
  useEffect(() => {
    if (isBlocked && isInContacts) {
      closeButtonMenu();
    } else {
      openButtonMenu();
    }
  }, [closeButtonMenu, openButtonMenu, isBlocked, isInContacts, user_uid]);
  const { contacts } = useContactsScreen();

  const defaultAvatar = isGroupOrChannel ? URL_DEFAUIT_Avatar_Croup : URL_DEFAUIT_Avatar;
  // создаем url для запроса картинки через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain(avatarUrl)}`;
  // создаем состояние которое динамически заменить картинку аватара на дефолтную в случае ошибки при её загрузке
  const [imgSrc, setImgSrc] = useState(result !== '/api/proxy' ? result : defaultAvatar);

  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);
  if (webSocketChatSrore === null) return <></>;
  const { sendCallCompletion } = webSocketChatSrore;

  const handleCall = async (): Promise<void> => {
    if (!isCallModalOpen) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        stream.getTracks().forEach((track) => track.stop());
      } catch {
        alert('Нет доступа к микрофону');
      }
    }
    toggleCallsOpen();
  };

  const handleRejectCall = (): void => {
    const requestUid = crypto.randomUUID();
    sendCallCompletion({
      action: 'call_completion',
      request_uid: requestUid,
      object: {
        from_user_uid: fromUserUid,
        to_user_uid: currentUid,
        type_complete: 'rejected',
        message_rtc_uid: messageRtcUid,
        duration: 0,
      },
    });
  };

  const handleUnblockUser = (): void => {
    openUnblockModal();
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.contactWrapper}>
          <div className={styles.image}>
            <Image
              src={imgSrc}
              alt={firstName}
              unoptimized
              width={40}
              height={40}
              className={styles.image}
              onClick={() => toggleInfoOpen()}
              onError={() => {
                setImgSrc(defaultAvatar);
              }}
            />
          </div>
          {searchMessagesVisible ? (
            <SearchMessages setSearchMessagesVisible={setSearchMessagesVisible} />
          ) : (
            <>
              <div
                className={clsx(
                  styles.info,
                  { [styles.blockButton]: isBlocked && isInfoOpen },
                  { [styles.isInfoOpen]: isInfoOpen },
                )}
                onClick={() => toggleInfoOpen()}
              >
                <span className={clsx(styles.name, { [styles.infoOpen]: isInfoOpen })}>
                  {isGroupOrChannel ? chat?.chat.name : `${firstName} ${lastName}`}
                </span>
                {isGroupOrChannel ? (
                  <span className={styles.group}>
                    {formatParticipants(participants?.length ? participants?.length - 1 : 1)}
                  </span>
                ) : (
                  <span className={styles.status}>{status}</span>
                )}
              </div>
              {isBlocked && (
                <ButtonUI
                  className={styles.unblockButton}
                  label={'Разблокировать'}
                  variant={'general'}
                  appearance={'primary'}
                  onClick={handleUnblockUser}
                />
              )}
              <div className={styles.icon} onClick={() => setSearchMessagesVisible(true)}>
                <SearchIcon />
              </div>
              {!isBlocked && (
                <div className={styles.icon} onClick={handleCall}>
                  <CallIcon />
                </div>
              )}
            </>
          )}
        </div>
        {searchMessagesStore && (
          <SearchResultCard
            currentSearchIndex={searchIndicatorStore?.currentSearchIndex ?? 0}
            lastSearchIndex={searchIndicatorStore?.lastSearchIndex ?? 0}
          />
        )}
        {!contacts?.some((c) => c.uid === user_uid) && (
          <HeaderTopButtonsBlock
            currentUid={currentUid}
            chatKey={user_uid}
            isBlocked={isBlocked}
            isInContact={isInContacts}
          />
        )}
        {isModalOpen && <NotificationModal />}
        {isBlockModalOpen && <BlockModal />}
        {isUnblockModalOpen && <UnblockContactModal uid={user_uid} fullName={`${firstName} ${lastName}`} />}
        {isAddModalOpen && <AddModal fullName={`${firstName} ${lastName}`} />}
        {isLeaveGroupModalOpen && <LeaveGroupModal chatKey={user_uid} name={nickname} />}
      </div>
      {isReceivingModalOpen && <ReceivingCallPanel onReject={handleRejectCall} onAccept={toggleIncomingModalOpen} />}
      {isCallModalOpen && (
        <OutgoingCallPanel
          avatarUrl={imgSrc}
          contact={`${firstName} ${lastName}`}
          user_uid={user_uid}
          currentUid={currentUid}
        />
      )}
      {isIncomingModalOpen && <IncomingCallPanel currentUid={currentUid} />}
    </>
  );
};
