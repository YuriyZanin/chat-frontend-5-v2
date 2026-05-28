'use client';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useCallsStore } from 'modules/conversation/messages-chat/model/calls/calls.store';
import { useInfoStore } from 'modules/info/model/info.store';
import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX, useEffect, useState } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ImageUI } from 'shared/ui/image';
import { NotificationModal } from '../../../../notification/ui/notification-modal';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
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
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';
const URL_DEFAULT_Avatar = '/images/messages-chats/default-avatar.svg';
export const HeaderTop = ({
  wsUrl,
  user_uid,
  currentUid,
}: {
  wsUrl: string;
  user_uid: string;
  currentUid: string;
}): JSX.Element => {
  //хук для получения списка чатов
  const { chats } = useChatsScreen();
  //хук для получения списка участников опреденной группы/канала (по chat_key)
  const { participants } = useParticipantsScreen(user_uid);

  const {
    isCallModalOpen,
    isIncomingModalOpen,
    isReceivingModalOpen,
    messageRtcUid,
    fromUserUid,
    toggleCallsOpen,
    toggleIncomingModalOpen,
  } = useCallsStore();
  const { toggleInfoOpen } = useInfoStore();
  const { isModalOpen } = useNotificationStore();
  const { isBlockModalOpen, isAddModalOpen, isLeaveGroupModalOpen, closeButtonMenu, openButtonMenu } =
    useHeaderButtonsModalStore();

  const isGroupOrChannel = user_uid.startsWith('group') || user_uid.startsWith('channel');
  const chat = isGroupOrChannel
    ? chats.find((c) => c.chat.chatKey === user_uid)
    : chats.find((c) => c.peer.uid === user_uid);
  const {
    avatarUrl = '',
    firstName = '',
    lastName = '',
    nickname = '',
    wasOnlineAt = null,
    isBlocked = false,
    isInContacts = false,
  } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);
  const [searchMessagesVisible, setSearchMessagesVisible] = useState<boolean>(false);
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
  const { sendCallCompletion } = useWebSocketChat(wsUrl, currentUid);

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
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.contactWrapper}>
          <div className={styles.image}>
            <ImageUI
              src={avatarUrl ? avatarUrl : URL_DEFAULT_Avatar}
              alt={firstName}
              width={40}
              height={40}
              className={styles.image}
              onClick={() => toggleInfoOpen()}
            />
          </div>
          {searchMessagesVisible ? (
            <SearchMessages setSearchMessagesVisible={setSearchMessagesVisible} />
          ) : (
            <>
              <div className={styles.info} onClick={() => toggleInfoOpen()}>
                <span className={styles.name}>{isGroupOrChannel ? chat?.chat.name : `${firstName} ${lastName}`}</span>
                {isGroupOrChannel ? (
                  <span className={styles.group}>
                    {formatParticipants(participants?.length ? participants?.length - 1 : 1)}
                  </span>
                ) : (
                  <span className={styles.status}>{status}</span>
                )}
              </div>
              <div className={styles.icon} onClick={() => setSearchMessagesVisible(true)}>
                <SearchIcon />
              </div>
              <div className={styles.icon} onClick={handleCall}>
                <CallIcon />
              </div>
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
            wsUrl={wsUrl}
            nickname={nickname ?? ''}
            currentUid={currentUid}
            chatKey={user_uid}
            isBlocked={isBlocked}
            isInContact={isInContacts}
          />
        )}
        {isModalOpen && <NotificationModal />}
        {isBlockModalOpen && <BlockModal />}
        {isAddModalOpen && <AddModal fullName={`${firstName} ${lastName}`} />}
        {isLeaveGroupModalOpen && (
          <LeaveGroupModal wsUrl={wsUrl} chatKey={user_uid} currentUid={currentUid} name={nickname} />
        )}
      </div>
      {isReceivingModalOpen && <ReceivingCallPanel onReject={handleRejectCall} onAccept={toggleIncomingModalOpen} />}
      {isCallModalOpen && (
        <OutgoingCallPanel
          avatarUrl={avatarUrl}
          contact={`${firstName} ${lastName}`}
          user_uid={user_uid}
          wsUrl={wsUrl}
          currentUid={currentUid}
        />
      )}
      {isIncomingModalOpen && <IncomingCallPanel wsUrl={wsUrl} currentUid={currentUid} />}
    </>
  );
};
