import { JSX } from 'react';
import styles from './date-card.module.scss';

export const DateCard = ({ date }: { date: string }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <span className={styles.text}> {date} </span>
      </div>
    </div>
  );
};
