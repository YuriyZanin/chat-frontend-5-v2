import clsx from 'clsx';
import { useAddContactQuery } from 'modules/conversation/contacts/api/contact.query';
import { useEditChatQuery, useSearchUserByNicknameQuery } from 'modules/info/api/info.query';
import { JSX } from 'react';
import { useChatsStore } from '../../model/search';
import styles from './context-menu.module.scss';
import AddContact from './icons/add-contact.svg';
import DeleteOutline from './icons/delete-outline.svg';
import MarkRead from './icons/mark-read.svg';
import PushPin from './icons/push-pin.svg';
import VolumeOf from './icons/volume-off.svg';

export const ContextMenu = ({
  chatId,
  lastMessageId,
  nickname,
  isInContacts,
  isFavorite,
  hasNewMessages,
  notifications,
  position,
  visible,
  onClose,
  chatType,
}: {
  chatId?: number;
  lastMessageId?: number;
  nickname?: string;
  isInContacts?: boolean;
  isFavorite?: boolean;
  hasNewMessages?: boolean;
  notifications?: boolean;
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
  chatType: 'chat' | 'public-group' | 'private-group' | 'public-channel' | 'private-channel' | undefined;
}): JSX.Element | null => {
  const { openDeleteModal, openAddModal, setSelected } = useChatsStore();
  const { mutate: addContact } = useAddContactQuery();
  const { data: users } = useSearchUserByNicknameQuery(nickname ?? '');
  const { mutate: editChat } = useEditChatQuery(chatId ?? 0);

  if (!visible) return null;

  const handleAddContact = (): void => {
    const contact = users ? users[0] : undefined;
    if (!!contact) {
      addContact({ user_uid: contact.uid });
      setSelected(chatId);
      openAddModal();
    }
    onClose();
  };

  const handleToggleNotification = (): void => {
    editChat({
      notifications: !notifications,
    });
    onClose();
  };

  const handleToggleFavorite = (): void => {
    editChat({
      is_favorite: !isFavorite,
    });
    onClose();
  };

  const handleMarkAsRead = (): void => {
    editChat({
      last_seen_message: lastMessageId,
    });
    onClose();
  };

  const handleDelete = (): void => {
    setSelected(chatId);
    openDeleteModal();
    onClose();
  };

  return (
    <div className={styles.wrapper} onMouseLeave={onClose} style={{ top: position.y, left: position.x }}>
      {!isInContacts && chatType === 'chat' && (
        <button className={clsx(styles.cell, styles.cellTop)} onClick={handleAddContact}>
          <div className={styles.text}>Добавить в контакты </div>
          <div className={styles.icon}>
            <AddContact />
          </div>
        </button>
      )}
      <button className={styles.cell} onClick={handleToggleNotification}>
        <div className={styles.text}>{notifications ? 'Выключить' : 'Включить'} уведомления</div>
        <div className={styles.icon}>
          <VolumeOf />
        </div>
      </button>
      <button className={styles.cell} onClick={handleToggleFavorite}>
        <div className={styles.text}>{isFavorite ? 'Открепить' : 'Закрепить'}</div>
        <div className={styles.icon}>
          <PushPin />
        </div>
      </button>
      {hasNewMessages && (
        <button className={styles.cell} onClick={handleMarkAsRead}>
          <div className={styles.text}>Пометить прочитанным</div>
          <div className={styles.icon}>
            <MarkRead />
          </div>
        </button>
      )}
      <button className={clsx(styles.cell, styles.cellBottom)} onClick={handleDelete}>
        <div className={clsx(styles.text, styles.textRed)}>Удалить чат</div>
        <div className={styles.icon}>
          <DeleteOutline />
        </div>
      </button>
    </div>
  );
};
