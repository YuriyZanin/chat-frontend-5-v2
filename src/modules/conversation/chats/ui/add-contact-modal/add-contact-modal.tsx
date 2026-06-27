import { JSX, useEffect } from 'react';
import { Modal } from 'shared/ui';
import { useChatsStore } from '../../model/search';
import { useChatsScreen } from '../../screens/use-chats-screen';
import AddIcon from './icons/add.svg';

export const AddContactModal = (): JSX.Element | null => {
  const { chats } = useChatsScreen();
  const selected = useChatsStore((s) => s.selected);
  const isAddModalOpen = useChatsStore((s) => s.isAddModalOpen);
  const closeAddModal = useChatsStore((s) => s.closeAddModal);

  const chat = chats.find((c) => c.chat.id === selected);
  const { firstName = '', lastName = '' } = chat?.peer ?? {};

  useEffect(() => {
    if (!isAddModalOpen) return;

    const timer = window.setTimeout(() => {
      closeAddModal();
    }, 2000);

    return (): void => clearTimeout(timer);
  }, [isAddModalOpen]);

  if (!isAddModalOpen) return null;

  return (
    <Modal
      icon={<AddIcon />}
      title={`${firstName} ${lastName}`}
      content="теперь в списке ваших контактов"
      onClose={closeAddModal}
    />
  );
};
