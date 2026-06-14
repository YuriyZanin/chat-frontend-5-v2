import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useInfoStore } from 'modules/info/model/info.store';
import { ClearGroupRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX, useState } from 'react';
import { Modal } from 'shared/ui';

export const ClearGroupModal = ({
  wsUrl,
  currentUid,
  chatKey,
  refreshUrl,
}: {
  wsUrl: string;
  currentUid: string;
  chatKey: string;
  refreshUrl: string;
}): JSX.Element | null => {
  const { isClearModalOpen, closeClearModal } = useInfoStore();
  const { openPopup, setCallback, setTitle, setTimer } = useNotificationStore();
  const { sendClearGroup } = useWebSocketChat(wsUrl, currentUid, refreshUrl);
  const queryClient = useQueryClient();
  const [clearForAll, setClearForAll] = useState<boolean>(false);

  const sendAndInvalidate = (): void => {
    const requestUid = crypto.randomUUID();
    const payload: ClearGroupRequestAPI = {
      action: 'clear_group_messages',
      request_uid: requestUid,
      object: {
        chat_key: chatKey,
        confirm: true,
      },
    };
    sendClearGroup(payload);
    queryClient.refetchQueries({ queryKey: ['messages', 'messages-list'] });
  };

  const handleClear = (): void => {
    if (chatKey) {
      setCallback(() => sendAndInvalidate());
      setTitle('История чата удалена');
      setTimer(5000);
      openPopup();
    }
    closeClearModal();
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
      onFirstButtonClick={closeClearModal}
      onSecondButtonClick={handleClear}
      onClose={closeClearModal}
    />
  );
};
