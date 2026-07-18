import { JSX } from 'react';
import { PinnedIcon } from '../icons';
import styles from './card-new-message-meta.module.scss';

export const CardNewMessageMeta = ({
  newMessageCount,
  isFavorite,
}: {
  newMessageCount: number;
  isFavorite: boolean | undefined;
}): JSX.Element | null => {
  if (newMessageCount > 0) {
    return (
      <div className={styles.newMessageMeta}>
        <span className={styles.unreadCount}>{newMessageCount}</span>
      </div>
    );
  }

  if (isFavorite) {
    return (
      <div className={styles.newMessageMeta}>
        <PinnedIcon className={styles.pinnedIcon} />
      </div>
    );
  }

  return null;
};
