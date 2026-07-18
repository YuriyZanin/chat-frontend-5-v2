import clsx from 'clsx';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useEditChatQuery } from 'modules/info/api/info.query';
import { JSX } from 'react';
import styles from './info-notification.module.scss';
import { InfoNotificationProps } from './info-notification.props';

export const InfoNotification = ({ chatId }: InfoNotificationProps): JSX.Element => {
  const { chats } = useChatsScreen();
  const { mutate: editChat } = useEditChatQuery(chatId ?? 0);

  const selected = chats.find((c) => c.chat.id === chatId);

  const handleToggle = (): void => {
    if (selected?.chat) {
      editChat({
        notifications: !selected.chat.notifications,
      });
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>Уведомления</span>
      <button className={styles.toggleButton} onClick={handleToggle}>
        <div className={clsx(styles.toggle, selected?.chat.notifications ? styles.enabled : styles.disabled)}>
          <div className={clsx(styles.circle, selected?.chat.notifications ? styles.enabled : styles.disabled)}></div>
        </div>
      </button>
    </div>
  );
};
