'use client';
import { formatMessages } from 'modules/conversation/messages-chat/utils/format-messages';
import { JSX } from 'react';
import Close from '../icons/close.svg';
import styles from './forward-messages-card.module.scss';
import type { ForwardMessagesCardProps } from './forward-messages-card.props';

export const ForwardMessagesCard = ({
  selectedMessagesStore,
  clearSelectedMessagesStore,
  currentUserId,
}: ForwardMessagesCardProps): JSX.Element => {
  const fromUsers = selectedMessagesStore?.map((m) => {
    return { uid: m.from_user.uid, firstName: m.from_user.first_name, lastName: m.from_user.last_name };
  });
  const uniqueFromUsers = [...new Map(fromUsers?.map((user) => [user.uid, user])).values()];
  const handleCloseClick = (): void => {
    clearSelectedMessagesStore();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.forwardBlock}>
        <div className={styles.textBlock}>
          <div className={styles.text1}>{`Переслать ${formatMessages(selectedMessagesStore?.length ?? 0)}`}</div>
          <div className={styles.text2}>{`От ${uniqueFromUsers.reduce((acc, user, index) => {
            acc =
              acc +
              (user.uid !== currentUserId
                ? `${user.firstName} ${user.lastName}${index !== uniqueFromUsers.length - 1 ? ', ' : ''}`
                : `Bы${index !== uniqueFromUsers.length - 1 ? ', ' : ''}`);
            return acc;
          }, '')}`}</div>
        </div>
        <button onClick={handleCloseClick}>
          <div className={styles.icon}>
            <Close />
          </div>
        </button>
      </div>
    </div>
  );
};
