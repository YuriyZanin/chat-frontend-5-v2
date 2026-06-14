import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useInfoStore } from 'modules/info/model/info.store';
import { AddOrRemoveMembersRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type DeleteMemberModalProps = {
  wsUrl: string;
  chatKey: string;
  currentUid: string;
  refreshUrl: string;
};

export const DeleteMemberModal = ({
  wsUrl,
  chatKey,
  currentUid,
  refreshUrl,
}: DeleteMemberModalProps): JSX.Element | null => {
  const { isDeleteParticipantModalOpen, uidToDelete, closeDeleteParticipantModal } = useInfoStore();
  const queryClient = useQueryClient();
  const { sendMembers } = useWebSocketChat(wsUrl, currentUid, refreshUrl);

  const { participants } = useParticipantsScreen(chatKey);
  const { firstName, lastName } = participants?.find((p) => p.uid === uidToDelete) ?? {};

  if (!isDeleteParticipantModalOpen) return null;

  const handleDelete = (): void => {
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
