import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useInfoStore } from 'modules/info/model/info.store';
import { DeleteGroupRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type DeleteGroupModalProps = {
  wsUrl: string;
  currentUid: string;
  chatKey: string;
  name: string;
  refreshUrl: string;
};

export const DeleteGroupModal = ({
  wsUrl,
  currentUid,
  chatKey,
  name,
  refreshUrl,
}: DeleteGroupModalProps): JSX.Element | null => {
  const { isDeleteGroupModalOpen, closeDeleteGroupModal, closeInfoScreen } = useInfoStore();
  const { sendDeleteGroup } = useWebSocketChat(wsUrl, currentUid, refreshUrl);
  const { openPopup, setCallback, setTitle, setTimer } = useNotificationStore();
  const queryClient = useQueryClient();
  const isGroup = chatKey.startsWith('group');

  if (!isDeleteGroupModalOpen) return null;

  const sendAndRefetch = (): void => {
    const requestUid = crypto.randomUUID();
    const payload: DeleteGroupRequestAPI = {
      action: 'delete_chat',
      request_uid: requestUid,
      object: { chat_key: chatKey },
    };
    sendDeleteGroup(payload);
    queryClient.invalidateQueries({ queryKey: ['chats', 'chat-list'] });
    closeInfoScreen();
  };

  const handleDelete = (): void => {
    setCallback(sendAndRefetch);
    setTitle('Группа удалена');
    setTimer(5000);
    openPopup();

    closeDeleteGroupModal();
  };

  return (
    <Modal
      title={`Удалить ${isGroup ? 'группу' : 'канал'} «${name}»?`}
      content={
        isGroup
          ? 'Вы точно хотите удалить эту группу и все сообщения в ней для всех участников? Это действие нельзя отменить.'
          : 'Вы точно хотите удалить этот канал и все публикации в нем для всех подписчиков? Это действие нельзя отменить.'
      }
      firstButtonText="Отменить"
      secondButtonText="Удалить"
      onFirstButtonClick={closeDeleteGroupModal}
      onSecondButtonClick={handleDelete}
      onClose={closeDeleteGroupModal}
    />
  );
};
