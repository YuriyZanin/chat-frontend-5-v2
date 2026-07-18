import { JSX } from 'react';
import CheckIcon from './icons/check.svg';
import styles from './scroll-button.module.scss';

export const ScrollButton = ({ quantity }: { quantity: number }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      {quantity !== 0 && <div className={styles.counter}>{quantity}</div>}
      <div className={styles.circle}>
        <CheckIcon />
      </div>
    </div>
  );
};
