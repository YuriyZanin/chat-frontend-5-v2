import clsx from 'clsx';
import { useAddContactQuery } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { useHeaderButtonsModalStore } from '../../zustand-store/zustand-store';
import styles from './header-top-buttons-block.module.scss';
import CloseIcon from './icon/close.svg';
export const HeaderTopButtonsBlock = ({
  currentUid,
  chatKey,
  isInContact,
  isBlocked,
}: {
  currentUid: string;
  chatKey: string;
  isInContact: boolean;
  isBlocked: boolean;
}): JSX.Element | null => {
  const { openBlockModal, openAddModal, openLeaveGroupModal, isButtonMenuOpen, closeButtonMenu } =
    useHeaderButtonsModalStore();
  const { isInfoOpen, enterSelectionMode, toggleInfoOpen } = useInfoStore();
  const { mutate: addToContact } = useAddContactQuery();
  const { participants } = useParticipantsScreen(chatKey);

  const member = participants?.find((p) => p.uid === currentUid);
  const isOwner = member?.isOwner ?? false;

  const pathname = usePathname();
  const isGroup = pathname.startsWith('/chats/group');
  const isChannel = pathname.startsWith('/chats/channel');

  const handleAddContact = (): void => {
    if (!!chatKey) {
      addToContact({ user_uid: chatKey });
      openAddModal();
    }
  };

  const handleAddMembers = (): void => {
    if (!isInfoOpen) {
      toggleInfoOpen();
    }
    enterSelectionMode();
  };

  const handleLeaveGroup = (): void => {
    openLeaveGroupModal();
  };

  if (!isButtonMenuOpen || (isGroup && !member)) return null;

  return (
    <div className={styles.wrapper}>
      {isGroup || isChannel ? (
        <>
          {isOwner ? (
            <button className={clsx(styles.buttonsWrapper, styles.addContact)} onClick={handleAddMembers}>
              {isChannel ? 'Пригласить подписчиков' : 'Добавить участников'}
            </button>
          ) : (
            <button className={clsx(styles.buttonsWrapper, styles.blockContact)} onClick={handleLeaveGroup}>
              {isChannel ? 'Покинуть канал' : 'Покинуть группу'}
            </button>
          )}
        </>
      ) : (
        <>
          <button
            className={clsx(styles.buttonsWrapper, styles.addContact, { [styles.blocked]: isInContact })}
            disabled={isInContact}
            onClick={handleAddContact}
          >
            Добавить в контакты
          </button>
          <button
            className={clsx(styles.buttonsWrapper, styles.blockContact, { [styles.blocked]: isBlocked })}
            disabled={isBlocked}
            onClick={openBlockModal}
          >
            Заблокировать
          </button>
        </>
      )}

      <button className={styles.icon} onClick={closeButtonMenu}>
        <CloseIcon />
      </button>
    </div>
  );
};
