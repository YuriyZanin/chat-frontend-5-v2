import { JSX, useEffect } from 'react';
import { Modal } from 'shared/ui';
import { useChatsStore } from '../../model/search';
import AddIcon from './icons/add.svg';

export const AddContactModal = ({ fullName }: { fullName: string }): JSX.Element | null => {
  const isAddModalOpen = useChatsStore((s) => s.isAddModalOpen);
  const closeAddModal = useChatsStore((s) => s.closeAddModal);

  useEffect(() => {
    if (!isAddModalOpen) return;

    const timer = window.setTimeout(() => {
      closeAddModal();
    }, 2000);

    return (): void => clearTimeout(timer);
  }, [isAddModalOpen]);

  if (!isAddModalOpen) return null;

  return (
    <Modal icon={<AddIcon />} title={fullName} content="теперь в списке ваших контактов" onClose={closeAddModal} />
  );
};
