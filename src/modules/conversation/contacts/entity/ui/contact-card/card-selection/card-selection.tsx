import clsx from 'clsx';
import { JSX } from 'react';
import styles from './card-selection.module.scss';
import { CardSelectionProps } from './card-selection.props';
import { CheckIcon } from './icons';

export const CardSelection = ({ visible, selected }: CardSelectionProps): JSX.Element | null => {
  if (!visible) return null;

  return (
    <span
      className={clsx(styles.circle, {
        [styles.circleSelect]: selected,
      })}
    >
      <CheckIcon
        className={clsx(styles.checkIcon, {
          [styles.iconSelect]: selected,
        })}
      />
    </span>
  );
};
