import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useInfoEditGroupStore } from 'modules/info/model/info.edit-group.store';
import { useInfoStore } from 'modules/info/model/info.store';
import { EditChatRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type EditChatModalProps = {
  wsUrl: string;
  currentUid: string;
  chatKey: string;
  refreshUrl: string;
};

export const EditChatModal = ({ wsUrl, currentUid, chatKey, refreshUrl }: EditChatModalProps): JSX.Element | null => {
  const { isEditChatModalOpen, closeEditChatModal, exitSettingsMode } = useInfoStore();
  const { resetGroup, avatarUid, name, description, chatType } = useInfoEditGroupStore();
  const queryClient = useQueryClient();
  const { sendEditGroup } = useWebSocketChat(wsUrl, currentUid, refreshUrl);

  if (!isEditChatModalOpen) return null;

  const handleSave = async (): Promise<void> => {
    const requestUid = crypto.randomUUID();
    const payload: EditChatRequestAPI = {
      action: 'edit_chat',
      request_uid: requestUid,
      object: {
        chat_key: chatKey,
        name: name,
        description: description,
        chat_type: chatType,
        avatar_uid: avatarUid,
      },
    };

    sendEditGroup(payload);

    await queryClient.refetchQueries({ queryKey: ['info', 'group', chatKey] });
    queryClient.invalidateQueries({ queryKey: ['chats', 'chat-list'] });

    resetGroup();
    closeEditChatModal();
    exitSettingsMode();
  };

  const handleClose = (): void => {
    resetGroup();
    closeEditChatModal();
    exitSettingsMode();
  };

  return (
    <Modal
      title={`Изменения не сохранены`}
      content={'Вы изменили настройки группы, сохранить внесённые изменения?'}
      firstButtonText="Применить"
      secondButtonText="Сбросить"
      onFirstButtonClick={handleSave}
      onSecondButtonClick={handleClose}
      onClose={handleClose}
    />
  );
};
