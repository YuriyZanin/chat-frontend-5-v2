import type { ChatType } from 'modules/conversation/chats/model/chat';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { useInfoStore } from 'modules/info/model/info.store';
import { LeaveGroupRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';
type LeaveGroupModalProps = {
  chatKey: string;
  name: string;
  chatType: ChatType | undefined;
};

export const LeaveGroupModal = ({ chatKey, name, chatType }: LeaveGroupModalProps): JSX.Element | null => {
  const { isLeaveGroupModalOpen, closeLeaveGroupModal } = useInfoStore();
  const { openPopup, setCallback, setTitle, setTimer } = useNotificationStore();
  // закрывает всю панель инфо
  const { closeInfoScreen } = useInfoStore();
  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  const handleLeaveGroup = (): void => {
    if (webSocketChatSrore === null) return;
    const { sendLeaveGroup } = webSocketChatSrore;
    const requestUid = crypto.randomUUID();
    const payload: LeaveGroupRequestAPI = {
      action: 'leave_chat',
      request_uid: requestUid,
      object: { chat_key: chatKey },
    };
    setCallback(() => sendLeaveGroup(payload));
    closeLeaveGroupModal();
    setTitle('Вы покинули Группу');
    setTimer(5000);
    openPopup();
    closeInfoScreen();
  };

  if (!isLeaveGroupModalOpen) return null;

  return (
    <Modal
      title={`Покинуть группу «${name}»?`}
      content={
        chatType === 'public-group'
          ? 'Это открытая группа — вы сможете вернуться в любой момент'
          : 'Вы не cможете просматривать сообщения и вернуться в группу без приглашения'
      }
      firstButtonText="Отменить"
      secondButtonText="Покинуть"
      onFirstButtonClick={closeLeaveGroupModal}
      onSecondButtonClick={handleLeaveGroup}
      onClose={closeLeaveGroupModal}
    />
  );
};
