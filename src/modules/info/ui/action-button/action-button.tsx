import { JSX, ReactNode } from 'react';
import styles from './action-button.module.scss';

export const ActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: ReactNode;
  onClick?: () => void;
}): JSX.Element => {
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onClick}>
        {icon}
        <span className={styles.label}>{label}</span>
      </button>
    </div>
  );
};
