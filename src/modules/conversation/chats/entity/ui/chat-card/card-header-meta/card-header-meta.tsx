import clsx from 'clsx';
import { JSX } from 'react';
import { formatChatTime } from 'shared/libs';
import { SentIcon } from '../icons';
import styles from './card-header-meta.module.scss';

export const CardHeaderMeta = ({ updatedAt, className }: { updatedAt?: number; className?: string }): JSX.Element => {
  return (
    <div className={clsx(styles.headerMeta, className)}>
      <SentIcon />
      <span className={styles.time}>{formatChatTime(updatedAt)}</span>
    </div>
  );
};
