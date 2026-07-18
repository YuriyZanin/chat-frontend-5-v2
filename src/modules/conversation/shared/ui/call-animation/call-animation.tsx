import { JSX } from 'react';
import styles from './call-animation.module.scss';

export const CallAnimation = (): JSX.Element => {
  return (
    <div className={styles.callAnimation}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};
