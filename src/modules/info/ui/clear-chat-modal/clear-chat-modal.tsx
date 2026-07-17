import { useClearChatMutation } from 'modules/conversation/chats/api/chat.query';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useInfoStore } from 'modules/info/model/info.store';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

export const ClearChatModal = (): JSX.Element | null => {
  const { contacts, globals } = useContactsScreen();
  const { uid, chatId, isClearModalOpen, closeClearModal } = useInfoStore();
  const { openPopup, setCallback, setTitle, setTimer } = useNotificationStore();

  const { mutate: clearChat } = useClearChatMutation();

  const contact = contacts?.find((c) => c.uid === uid) ?? globals?.find((c) => c.uid === uid);
  const { firstName, lastName } = contact ?? {};

  const handleClear = (): void => {
    if (chatId) {
      setCallback(() => clearChat({ id: chatId }));
      setTitle('История чата удалена');
      setTimer(5000);
      openPopup();
    }
    closeClearModal();
  };

  if (!isClearModalOpen) return null;

  return (
    <Modal
      title={`Очистить чат с ${firstName} ${lastName}?`}
      content={'Все сообщения в этом чате будут удалены только для вас. Собеседник по-прежнему сможет их видеть'}
      firstButtonText="Отменить"
      secondButtonText="Очистить"
      onFirstButtonClick={closeClearModal}
      onSecondButtonClick={handleClear}
      onClose={closeClearModal}
    />
  );
};
