'use client';
import { JSX, useEffect } from 'react';
import { useWebSocketChatStore } from '../api/web-socket/use-web-socket-chat-store';
import { DefaultMessagesPage } from '../ui/default-messages-page';
import { MessagesList } from '../ui/messages-list/messages-list';
import { useCurrentUserIdStore, useMessagesChatStore, useUserIdStore } from '../zustand-store/zustand-store';
import { MessagesListScreenProps } from './messades-list-screen.props';
import { useMessagesListScreen } from './use-messages-list-screen';

export const MessagesListScreen = ({ user_uid, currentUserId }: MessagesListScreenProps): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const setUserIdStore = useUserIdStore((s) => s.setUserId);
  const setCurrentUserIdStore = useCurrentUserIdStore((s) => s.setCurrentUserId);

  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[userIdStore]) ?? [];
  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);
  const setMessagesForUser = useMessagesChatStore((s) => s.setMessagesForUser);
  const parts = userIdStore.split('_');
  const userUid = parts.length > 1 ? parts[1] : parts[0];
  const { messagesList, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessagesListScreen(userUid);

  useEffect(() => {
    setUserIdStore(user_uid);
    setCurrentUserIdStore(currentUserId);
  }, [user_uid, setUserIdStore, currentUserId, setCurrentUserIdStore]);

  useEffect(() => {
    if (!userIdStore) return;
    const normalized = messagesList.map((m) => ({ ...m, status: 'sent' as const }));
    setMessagesForUser(userIdStore, normalized);
  }, [messagesList, userIdStore, setMessagesForUser]);

  if (webSocketChatSrore === null) return <></>;
  const { sendChangeStatusReadMessage, sendDeleteMessage } = webSocketChatSrore;
  if (
    messagesByUser.length > 1 ||
    (status === 'success' && messagesList.length > 1) ||
    (messagesByUser.length === 1 && messagesByUser[0]?.from_user.uid !== currentUserId) ||
    (status === 'success' && messagesList.length === 1 && messagesList[0]?.from_user.uid !== currentUserId) ||
    (messagesByUser.length === 1 &&
      messagesByUser[0]?.from_user.uid === currentUserId &&
      !messagesByUser[0]?.content?.startsWith('@@@')) ||
    (status === 'success' &&
      messagesList.length === 1 &&
      messagesList[0]?.from_user.uid === currentUserId &&
      !messagesList[0]?.content?.startsWith('@@@'))
  ) {
    return (
      <MessagesList
        messagesByUser={messagesByUser}
        currentUserId={currentUserId}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sendChangeStatusReadMessage={sendChangeStatusReadMessage}
        sendDeleteMessage={sendDeleteMessage}
        userIdStore={userIdStore}
      />
    );
  } else {
    if (status === 'success' && parts[0] === 'group') {
      return (
        <DefaultMessagesPage
          url={'/images/messages-chats/default-img-group.svg'}
          topText={'Вы создали группу'}
          bottomText={''}
        />
      );
    }
    if (status === 'success' && parts[0] === 'channel') {
      return (
        <DefaultMessagesPage
          url={'/images/messages-chats/default-img-channel.svg'}
          topText={'Вы создали канал'}
          bottomText={'Добавьте публикацию'}
        />
      );
    }
    if (status === 'success') {
      return (
        <DefaultMessagesPage
          url={'/images/messages-chats/default-img.svg'}
          topText={'Сообщений пока нет'}
          bottomText={'Напишите первым :)'}
        />
      );
    }
    return <></>;
  }
};
