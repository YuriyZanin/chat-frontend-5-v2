import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { useInfoStore } from 'modules/info/model/info.store';
import type { TransferOwnerRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type MakeAdministratorModalProps = {
  chatKey: string;
};

export const MakeAdministratorModal = ({ chatKey }: MakeAdministratorModalProps): JSX.Element | null => {
  const queryClient = useQueryClient();
  const { isMakeAdministratorModalOpen, closeMakeAdministratorModal, selectedAdministrator } = useInfoStore();
  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  const handleMakeAdministrator = (): void => {
    if (webSocketChatSrore === null) return;
    const { sendMakeAdministratorGroupOrChannel } = webSocketChatSrore;
    const requestUid = crypto.randomUUID();
    const payload: TransferOwnerRequestAPI = {
      action: 'transfer_owner',
      request_uid: requestUid,
      object: {
        chat_key: chatKey,
        new_owner_uid: selectedAdministrator?.uid ?? '',
      },
    };
    sendMakeAdministratorGroupOrChannel(payload);
    closeMakeAdministratorModal();
  };

  if (!isMakeAdministratorModalOpen) return null;

  return (
    <Modal
      title={`Сделать администратором ${selectedAdministrator?.firstName} ${selectedAdministrator?.lastName}?`}
      content={`Это означает, что вы больше ничего не сможете изменить в ${chatKey.startsWith('group_') ? 'этой группе' : 'этом канале'}, не будет доступа к настройкам`}
      firstButtonText="Отменить"
      secondButtonText="Сделать администратором"
      onFirstButtonClick={closeMakeAdministratorModal}
      onSecondButtonClick={handleMakeAdministrator}
      onClose={closeMakeAdministratorModal}
    />
  );
};
