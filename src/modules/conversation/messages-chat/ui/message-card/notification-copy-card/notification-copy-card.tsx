import { JSX } from 'react';
import Copy from '../icons/copy.svg';
import styles from './notification-copy-card.module.scss';

export const NotificationCopyCard = ({ posCopy }: { posCopy: { top: number; left: number } }): JSX.Element => {
  return (
    <div
      className={styles.wrapper}
      style={{
        position: 'fixed',
        left: `${posCopy.left}px`,
        top: `${posCopy.top}px`,
      }}
    >
      <div className={styles.icon}>
        <Copy />
      </div>
      <div className={styles.text}>Скопировано в буфер обмена</div>
    </div>
  );
};
