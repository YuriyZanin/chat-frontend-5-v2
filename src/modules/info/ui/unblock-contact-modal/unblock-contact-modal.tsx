import { useUnblockUserMutation } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

export const UnblockContactModal = ({ uid, fullName }: { uid: string; fullName: string }): JSX.Element | null => {
  const { isUnblockModalOpen, closeUnblockModal } = useInfoStore();

  const { mutate: unblockContact } = useUnblockUserMutation(uid ?? '');

  const handleUnblock = (): void => {
    if (uid) {
      unblockContact();
    }
    closeUnblockModal();
  };

  if (!isUnblockModalOpen) return null;

  return (
    <Modal
      title={`Разблокировать ${fullName}?`}
      content=""
      firstButtonText="Да"
      secondButtonText="Нет"
      onFirstButtonClick={handleUnblock}
      onSecondButtonClick={closeUnblockModal}
      onClose={closeUnblockModal}
    />
  );
};
