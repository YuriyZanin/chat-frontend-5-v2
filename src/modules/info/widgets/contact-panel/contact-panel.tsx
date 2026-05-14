import { useChatsStore } from 'modules/conversation/chats/model/search';
import { AddContactModal } from 'modules/conversation/chats/ui/add-contact-modal';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useMessagesChatStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useAddContactQuery, useSearchUserByNicknameQuery } from 'modules/info/api/info.query';
import { ProfileInfo } from 'modules/info/entity/info.entity';
import { useInfoStore } from 'modules/info/model/info.store';
import { formatTimestamp } from 'modules/info/shared/utils/date-time';
import { ActionButton } from 'modules/info/ui/action-button';
import { BlockContactModal } from 'modules/info/ui/block-contact-modal';
import { ClearChatModal } from 'modules/info/ui/clear-chat-modal';
import { FrowardProfileModal } from 'modules/info/ui/forward-profile-modal';
import { InfoAvatar } from 'modules/info/ui/info-avatar';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { InfoSummary } from 'modules/info/ui/info-summary';
import { InfoUploads } from 'modules/info/ui/info-uploads';
import { UnblockContactModal } from 'modules/info/ui/unblock-contact-modal';
import { JSX } from 'react';
import AddIcon from '../../shared/icons/add.svg';
export const ContactPanel = ({
  uid,
  currentUid,
  wsUrl,
  profile,
  isLoading,
}: {
  uid: string;
  currentUid: string;
  wsUrl: string;
  profile?: ProfileInfo;
  isLoading: boolean;
}): JSX.Element => {
  const { mutate: addToContact } = useAddContactQuery();
  const { openAddModal } = useChatsStore();
  const { openUnblockModal } = useInfoStore();
  const { contacts } = useContactsScreen();

  const contact = contacts?.find((c) => c.uid === uid);
  const { nickname, firstName, lastName, avatarUrl, isOnline, isBlocked } = profile ?? {};
  const isInContacts = !!contact;
  const chatId = profile?.chatId;

  const { data: users } = useSearchUserByNicknameQuery(nickname ?? '');
  const user = users ? users[0] : undefined;

  const handleAddContact = (): void => {
    if (!!user) {
      addToContact({ phone: user?.phone, first_name: user?.first_name, last_name: user?.last_name });
      openAddModal();
    }
  };

  const handleUnblockContact = (): void => {
    openUnblockModal();
  };

  // все сообщения определенного чата(определеного uid профиля)
  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[uid]);
  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoAvatar
            avatarHref={avatarUrl ?? '/images/profile/default.png'}
            label={`${firstName} ${lastName}`}
            status={isOnline ? 'в сети' : 'не в сети'}
          />
          <InfoNotification chatId={chatId} />
          <InfoSummary
            nickname={nickname ?? ''}
            phoneNumber={user?.phone}
            birthDay={formatTimestamp(user?.birthday)}
            about={user?.additional_information}
          />
          {!isInContacts && (
            <ActionButton icon={<AddIcon />} label={'Добавить в контакты'} onClick={handleAddContact} />
          )}
          {isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={handleUnblockContact} />}
          <InfoUploads messagesByUser={messagesByUser} currentUid={currentUid} wsUrl={wsUrl} />
          <AddContactModal />
          <BlockContactModal />
          <UnblockContactModal />
          <ClearChatModal />
          <FrowardProfileModal wsUrl={wsUrl} currentUid={currentUid} nickname={nickname ?? ''} />
        </>
      )}
    </>
  );
};
