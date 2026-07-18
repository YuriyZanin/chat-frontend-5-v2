import { JSX, ReactNode } from 'react';
import styles from './messages-sections.module.scss';

export const MessageSections = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>{children}</div>
    </div>
  );
};
