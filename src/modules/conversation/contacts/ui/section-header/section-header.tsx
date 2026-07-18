import clsx from 'clsx';
import { JSX } from 'react';
import styles from './section-header.module.scss';
import { SectionHeaderProps } from './section-header.props';

export const SectionHeader = ({ label, isHighlighted, leftAction, rightAction }: SectionHeaderProps): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.actionContainer}>
        {leftAction}
        <span
          className={clsx(styles.label, {
            [styles.selected]: isHighlighted,
          })}
        >
          {label}
        </span>
      </div>

      {rightAction}
    </div>
  );
};
