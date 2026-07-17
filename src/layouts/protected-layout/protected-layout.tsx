'use client';
import clsx from 'clsx';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX, useEffect } from 'react';
import styles from './protected-layout.module.scss';
import { ProtectedLayoutProps } from './protected-layout.props';

export const ProtectedLayout = ({
  nav,
  list,
  main,
  info,
  wsUrl,
  currentUserId,
  refreshUrl,
}: ProtectedLayoutProps): JSX.Element => {
  const { isInfoOpen } = useInfoStore();
  // подключаем ws-соединение
  const {
    sendMessage,
    sendProfile,
    sendChangeStatusReadMessage,
    sendDeleteMessage,
    sendMembers,
    sendLeaveGroup,
    sendDeleteGroup,
    sendEditGroup,
    sendClearGroup,
    sendAnswerCall,
    sendCallCompletion,
    sendCallStateUpdate,
    sendIceCandidate,
    sendOfferCall,
    createGroupOrChannel,
    sendMakeAdministratorGroupOrChannel,
  } = useWebSocketChat(wsUrl, currentUserId, refreshUrl);
  // все полученные функции для работы с ws-соединения записываем в store чтобы использовать их в любом месте программы
  const setWebSocketChatStore = useWebSocketChatStore((s) => s.setWebSocketChat);
  useEffect(() => {
    setWebSocketChatStore({
      sendMessage,
      sendProfile,
      sendChangeStatusReadMessage,
      sendDeleteMessage,
      sendMembers,
      sendLeaveGroup,
      sendDeleteGroup,
      sendEditGroup,
      sendClearGroup,
      sendAnswerCall,
      sendCallCompletion,
      sendCallStateUpdate,
      sendIceCandidate,
      sendOfferCall,
      createGroupOrChannel,
      sendMakeAdministratorGroupOrChannel,
    });
  }, [setWebSocketChatStore]);

  return (
    <div className={styles.root}>
      <div className={styles.shell}>
        <div className={styles.mainGrid}>
          <aside className={styles.nav}>{nav}</aside>
          <aside className={styles.list}>{list}</aside>
          <main className={clsx(styles.main, { [styles.open]: isInfoOpen })}>{main}</main>
        </div>
        {isInfoOpen && <div className={clsx(styles.info, { [styles.open]: isInfoOpen })}>{info}</div>}
      </div>
    </div>
  );
};
