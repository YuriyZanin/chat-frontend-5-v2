import clsx from 'clsx';
import { JSX } from 'react';
import styles from './card-header.module.scss';
import { CardHeaderProps } from './card-header.props';

export const CardHeader = ({ title, selected = false, children }: CardHeaderProps): JSX.Element => {
  return (
    <div
      className={clsx(styles.header, {
        [styles.selected]: selected,
      })}
    >
      <span className={styles.title}>{title}</span>
      {children}
    </div>
  );
};
