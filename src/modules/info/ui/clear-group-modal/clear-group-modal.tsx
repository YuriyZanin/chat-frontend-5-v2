import { useQueryClient } from '@tanstack/react-query';
import { useClearChatMutation } from 'modules/conversation/chats/api/chat.query';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import type { GroupInfo } from 'modules/info/entity/info.entity';
import { useInfoStore } from 'modules/info/model/info.store';
import { ClearGroupRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX, useState } from 'react';
import { Modal } from 'shared/ui';

export const ClearGroupModal = ({ profile }: { profile: GroupInfo | undefined }): JSX.Element | null => {
  const { isClearModalOpen, closeClearModal } = useInfoStore();
  const { openPopup, setCallback, setTitle, setTimer } = useNotificationStore();
  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);
  const queryClient = useQueryClient();
  const [clearForAll, setClearForAll] = useState<boolean>(false);

  // хук для удаления всех сообщений в чате (только у себя ).
  const { mutate: clearChat } = useClearChatMutation();
  const body = {
    is_favorite: profile?.isFavorite || false,
    last_message: {
      from_user: profile?.lastMessage?.fromUser || '',
      new: true,
    },
  };

  // функция для удаления всех сообщений в группе/канале владельцем (у всеx) c перезагрузкой страницы
  const sendAndInvalidate = (): void => {
    if (webSocketChatSrore === null) return;
    const { sendClearGroup } = webSocketChatSrore;
    const requestUid = crypto.randomUUID();
    const payload: ClearGroupRequestAPI = {
      action: 'clear_group_messages',
      request_uid: requestUid,
      object: {
        chat_key: profile?.chatKey || '',
        confirm: true,
      },
    };
    sendClearGroup(payload);
    queryClient.refetchQueries({ queryKey: ['messages', 'messages-list'] });
  };

  const handleClear = (): void => {
    if (profile?.chatKey && profile?.id) {
      if (clearForAll) {
        setCallback(() => sendAndInvalidate());
      } else {
        setCallback(() => clearChat({ id: profile?.id, body }));
      }

      setTitle('История чата удалена');
      setTimer(5000);
      openPopup();
    }
    closeClearModal();
    setClearForAll(false);
  };

  const handleCloseClearModal = (): void => {
    closeClearModal();
    setClearForAll(false);
  };

  if (!isClearModalOpen) return null;

  return (
    <Modal
      title={`Очистить чат?`}
      content={
        clearForAll
          ? 'Все сообщения в этой группе будут удалены  для всех участников'
          : 'Все сообщения в этой группе будут удалены только для вас. Участники по-прежнему смогут их видеть'
      }
      firstButtonText="Отменить"
      secondButtonText="Очистить"
      checkboxText="Удалить для всех"
      toggleCheckBox={setClearForAll}
      checked={clearForAll}
      onFirstButtonClick={handleCloseClearModal}
      onSecondButtonClick={handleClear}
      onClose={handleCloseClearModal}
    />
  );
};
