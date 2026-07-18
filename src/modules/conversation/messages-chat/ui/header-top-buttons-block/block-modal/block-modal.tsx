import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useBlockUserMutation } from 'modules/info/api';
import { JSX } from 'react';
import { Modal } from 'shared/ui';
import { useHeaderButtonsModalStore, useUserIdStore } from '../../../zustand-store/zustand-store';

export const BlockModal = (): JSX.Element | null => {
  const { contacts, globals } = useContactsScreen();
  const { userId } = useUserIdStore();
  const { isBlockModalOpen, closeBlockModal } = useHeaderButtonsModalStore();

  const { mutate: blockContact } = useBlockUserMutation(userId ?? '');

  const contact = contacts?.find((c) => c.uid === userId) ?? globals?.find((c) => c.uid === userId);
  const { firstName, lastName } = contact ?? {};

  const handleBlock = (): void => {
    if (userId) {
      blockContact();
    }
    closeBlockModal();
  };

  if (!isBlockModalOpen) return null;

  return (
    <Modal
      title={`Заблокировать ${firstName} ${lastName}?`}
      content="Пользователь не сможет писать Вам личные сообщения, звонить и приглашать Вас в группы и каналы"
      firstButtonText="Отмена"
      secondButtonText="Заблокировать"
      onFirstButtonClick={closeBlockModal}
      onSecondButtonClick={handleBlock}
      onClose={closeBlockModal}
    />
  );
};
