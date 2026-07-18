import clsx from 'clsx';
import { JSX } from 'react';
import styles from './card-info.module.scss';
import { CardInfoProps } from './card-info.props';

export const CardInfo = ({ fullName, status, selected }: CardInfoProps): JSX.Element => {
  return (
    <div className={styles.info}>
      <span
        className={clsx(styles.name, {
          [styles.nameSelect]: selected,
        })}
      >{`${fullName}`}</span>
      <span
        className={clsx(styles.status, {
          [styles.online]: status === 'в сети',
          [styles.statusSelect]: selected,
        })}
      >
        {status}
      </span>
    </div>
  );
};
