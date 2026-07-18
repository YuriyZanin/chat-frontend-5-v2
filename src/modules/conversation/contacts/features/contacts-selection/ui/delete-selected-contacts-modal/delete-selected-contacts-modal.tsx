'use client';

import {
  useContactsSelectionStore,
  useDeleteContactsMutation,
} from 'modules/conversation/contacts/features/contacts-selection';
import { JSX } from 'react';
import { pluralize } from 'shared/libs';
import { Modal } from 'shared/ui/modal';

export const DeleteSelectedContactsModal = (): JSX.Element | null => {
  const { selectedIds, clearSelection, isDeleteModalOpen, closeDeleteModal, exitSelectionMode } =
    useContactsSelectionStore();

  const { mutate: deleteContacts } = useDeleteContactsMutation({
    onSuccess: () => {
      clearSelection();
      closeDeleteModal();
      exitSelectionMode();
    },
  });

  const count = selectedIds.size;

  if (!isDeleteModalOpen) return null;

  return (
    <Modal
      title="Удалить контакты"
      content={`Вы уверены, что хотите удалить ${count} ${pluralize(count, 'contacts')}`}
      firstButtonText="Удалить"
      secondButtonText="Отмена"
      onFirstButtonClick={() => {
        deleteContacts(Array.from(selectedIds));
      }}
      onSecondButtonClick={closeDeleteModal}
      onClose={closeDeleteModal}
    />
  );
};
