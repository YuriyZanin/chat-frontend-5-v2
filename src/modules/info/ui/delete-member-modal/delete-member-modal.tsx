import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChatStore } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat-store';
import { useInfoStore } from 'modules/info/model/info.store';
import { AddOrRemoveMembersRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type DeleteMemberModalProps = {
  chatKey: string;
};

export const DeleteMemberModal = ({ chatKey }: DeleteMemberModalProps): JSX.Element | null => {
  const { isDeleteParticipantModalOpen, uidToDelete, closeDeleteParticipantModal } = useInfoStore();
  const queryClient = useQueryClient();

  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  const { participants } = useParticipantsScreen(chatKey);
  const { firstName, lastName } = participants?.find((p) => p.uid === uidToDelete) ?? {};

  if (!isDeleteParticipantModalOpen) return null;

  const handleDelete = (): void => {
    if (webSocketChatSrore === null) return;
    const { sendMembers } = webSocketChatSrore;
    if (uidToDelete) {
      const requestUid = crypto.randomUUID();
      const payload: AddOrRemoveMembersRequestAPI = {
        action: 'remove_members_from_chat',
        request_uid: requestUid,
        object: {
          chat_key: chatKey,
          uid_users_list: [uidToDelete],
        },
      };
      sendMembers(payload);
      queryClient.invalidateQueries({
        queryKey: ['participants', 'participants-list', chatKey],
      });
    }
    closeDeleteParticipantModal();
  };

  return (
    <Modal
      title={`Удалить ${firstName} ${lastName} из группы?`}
      content="Пользователь потеряет доступ ко всем сообщениям и не сможет вернуться без приглашения"
      firstButtonText="Отменить"
      secondButtonText="Удалить"
      onFirstButtonClick={closeDeleteParticipantModal}
      onSecondButtonClick={handleDelete}
      onClose={closeDeleteParticipantModal}
    />
  );
};
