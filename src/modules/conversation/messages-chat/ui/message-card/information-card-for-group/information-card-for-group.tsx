import { JSX } from 'react';
import styles from './information-card-for-group.module.scss';

export const informationForGroupCard = ({ text }: { text: string }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.text}> {text} </span>
    </div>
  );
};
