'use client';
import { JSX, useEffect } from 'react';
import { useWebSocketChat } from '../api/web-socket/use-web-socket-chat';
import { DefaultMessagesPage } from '../ui/default-messages-page';
import { MessagesList } from '../ui/messages-list/messages-list';
import { useMessagesChatStore, useUserIdStore } from '../zustand-store/zustand-store';
import { MessagesListScreenProps } from './messades-list-screen.props';
import { useMessagesListScreen } from './use-messages-list-screen';
export const MessagesListScreen = ({ user_uid, wsUrl, currentUserId }: MessagesListScreenProps): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const setUserIdStore = useUserIdStore((s) => s.setUserId);

  useEffect(() => {
    setUserIdStore(user_uid);
  }, [user_uid, setUserIdStore]);

  const parts = userIdStore.split('_');
  const userUid = parts.length > 1 ? parts[1] : parts[0];
  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[userIdStore]) ?? [];
  const { messagesList, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessagesListScreen(userUid);

  const { sendChangeStatusReadMessage, sendDeleteMessage } = useWebSocketChat(wsUrl, currentUserId);

  if ((status === 'success' && messagesByUser.length > 0) || (status === 'success' && messagesList.length > 0)) {
    return (
      <MessagesList
        messagesList={messagesList}
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
    if (status === 'success' && messagesByUser.length === 0) {
      if (parts[0] === 'group') {
        return (
          <DefaultMessagesPage
            url={'/images/messages-chats/default-img-group.svg'}
            topText={'Вы создали группу'}
            bottomText={''}
          />
        );
      }
      if (parts[0] === 'channel') {
        return (
          <DefaultMessagesPage
            url={'/images/messages-chats/default-img-channel.svg'}
            topText={'Вы создали канал'}
            bottomText={'Добавьте публикацию'}
          />
        );
      }
      return (
        <DefaultMessagesPage
          url={'/images/messages-chats/default-img.svg'}
          topText={'Сообщений пока нет'}
          bottomText={'Напишите первым :)'}
        />
      );
    } else {
      return <></>;
    }
  }
};
