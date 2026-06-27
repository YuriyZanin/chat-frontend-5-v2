import { useChatsStore } from 'modules/conversation/chats/model/search';
import { AddContactModal } from 'modules/conversation/chats/ui/add-contact-modal';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useAddContactQuery, useSearchUserByNicknameQuery } from 'modules/info/api/info.query';
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
import type { ContactPanelProps } from './contact-panel.props';

const URL_DEFAUIT_Avatar = '/images/profile/default.png';

export const ContactPanel = ({ uid, currentUid, profile, isLoading, filesList }: ContactPanelProps): JSX.Element => {
  const { mutate: addToContact } = useAddContactQuery();
  const openAddModal = useChatsStore((s) => s.openAddModal);
  const { openUnblockModal } = useInfoStore();
  const { contacts } = useContactsScreen();

  const contact = contacts?.find((c) => c.uid === uid);
  const { nickname, firstName, lastName, avatarUrl, isOnline, isBlocked } = profile ?? {};
  const isInContacts = !!contact;
  const chatId = profile?.chatId;
  const { data: users } = useSearchUserByNicknameQuery(nickname ?? '');
  const user = users ? users[0] : undefined;
  const handleAddContact = (): void => {
    console.log('click add contact, user=', user);
    if (!!user) {
      addToContact({ user_uid: uid });
      openAddModal();
    }
  };
  const handleUnblockContact = (): void => {
    openUnblockModal();
  };
  const tabs = ['Медиа', 'Файлы', 'Голосовые', 'Ссылки'];
  // создаем url для запроса картинки через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain(avatarUrl ?? '')}`;

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoAvatar
            avatarHref={result !== '/api/proxy' ? result : URL_DEFAUIT_Avatar}
            label={`${firstName} ${lastName}`}
            status={isOnline ? 'в сети' : 'не в сети'}
          />
          <InfoNotification chatId={chatId} />
          <InfoSummary
            nickname={nickname ?? ''}
            phoneNumber={user?.phone}
            birthDay={formatTimestamp(profile?.birthday)}
            about={profile?.additionalInformation}
          />
          {!isInContacts && (
            <ActionButton icon={<AddIcon />} label={'Добавить в контакты'} onClick={handleAddContact} />
          )}
          {isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={handleUnblockContact} />}
          <InfoUploads tabs={tabs} currentUid={currentUid} filesList={filesList} />
          <AddContactModal />
          <BlockContactModal />
          <UnblockContactModal />
          <ClearChatModal />
          <FrowardProfileModal nickname={nickname ?? ''} />
        </>
      )}
    </>
  );
};
