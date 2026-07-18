import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useBlockUserMutation } from 'modules/info/api';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

export const BlockContactModal = (): JSX.Element | null => {
  const { contacts, globals } = useContactsScreen();
  const { uid, isBlockModalOpen, closeBlockModal } = useInfoStore();

  const { mutate: blockContact } = useBlockUserMutation(uid ?? '');

  const contact = contacts?.find((c) => c.uid === uid) ?? globals?.find((c) => c.uid === uid);
  const { firstName, lastName } = contact ?? {};

  const handleBlock = (): void => {
    if (uid) {
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
