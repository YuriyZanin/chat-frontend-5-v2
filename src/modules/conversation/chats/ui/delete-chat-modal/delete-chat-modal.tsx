import { JSX } from 'react';
import { Modal } from 'shared/ui';
import { useDeleteChatMutation } from '../../api/chat.query';
import { useChatsStore } from '../../model/search';
import { useChatsScreen } from '../../screens/use-chats-screen';

export const DeleteChatModal = (): JSX.Element | null => {
  const { chats } = useChatsScreen();
  const { selected, isDeleteModalOpen, closeDeleteModal } = useChatsStore();
  const { mutate: deleteChat } = useDeleteChatMutation();

  const chat = chats.find((c) => c.chat.id === selected);
  const { firstName = '', lastName = '' } = chat?.peer ?? {};

  const handleDelete = (): void => {
    if (selected) {
      deleteChat(selected);
    }
    closeDeleteModal();
  };

  if (!isDeleteModalOpen) return null;

  return (
    <Modal
      title="Удалить чат"
      content={`Удалить чат с ${firstName} ${lastName} без возможности восстановления?`}
      firstButtonText="Удалить"
      secondButtonText="Отмена"
      onFirstButtonClick={handleDelete}
      onSecondButtonClick={closeDeleteModal}
      onClose={closeDeleteModal}
    />
  );
};
