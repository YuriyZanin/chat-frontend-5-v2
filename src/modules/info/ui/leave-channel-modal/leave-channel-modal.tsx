import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useInfoStore } from 'modules/info/model/info.store';
import { LeaveGroupRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type LeaveGroupModalProps = {
  wsUrl: string;
  chatKey: string;
  currentUid: string;
  name: string;
  refreshUrl: string;
};

export const LeaveChannelModal = ({
  wsUrl,
  chatKey,
  currentUid,
  name,
  refreshUrl,
}: LeaveGroupModalProps): JSX.Element | null => {
  const queryClient = useQueryClient();
  const { isLeaveGroupModalOpen, closeLeaveGroupModal } = useInfoStore();
  const { sendLeaveGroup } = useWebSocketChat(wsUrl, currentUid, refreshUrl);

  if (!isLeaveGroupModalOpen) return null;

  const handleLeaveChannel = (): void => {
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
      title={`Покинуть  канал «${name}»?`}
      content={''}
      firstButtonText="Отменить"
      secondButtonText="Отписаться"
      onFirstButtonClick={closeLeaveGroupModal}
      onSecondButtonClick={handleLeaveChannel}
      onClose={closeLeaveGroupModal}
    />
  );
};
