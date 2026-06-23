import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { useInfoStore } from 'modules/info/model/info.store';
import { LeaveGroupRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type LeaveGroupModalProps = {
  chatKey: string;
  name: string;
};

export const LeaveGroupModal = ({ chatKey, name }: LeaveGroupModalProps): JSX.Element | null => {
  const queryClient = useQueryClient();
  const { isLeaveGroupModalOpen, closeLeaveGroupModal } = useInfoStore();
  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  if (!isLeaveGroupModalOpen) return null;

  const handleLeaveGroup = (): void => {
    if (webSocketChatSrore === null) return;
    const { sendLeaveGroup } = webSocketChatSrore;
    const requestUid = crypto.randomUUID();
    const payload: LeaveGroupRequestAPI = {
      action: 'leave_chat',
      request_uid: requestUid,
      object: { chat_key: chatKey },
    };

    sendLeaveGroup(payload);

    queryClient.refetchQueries({
      queryKey: ['participants', 'participants-list', chatKey],
    });

    closeLeaveGroupModal();
  };

  return (
    <Modal
      title={`Покинуть группу «${name}»?`}
      content={'Это открытая группа — вы сможете вернуться в любой момент'}
      firstButtonText="Отменить"
      secondButtonText="Покинуть"
      onFirstButtonClick={closeLeaveGroupModal}
      onSecondButtonClick={handleLeaveGroup}
      onClose={closeLeaveGroupModal}
    />
  );
};
